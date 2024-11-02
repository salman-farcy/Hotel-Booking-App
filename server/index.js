const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const port = process.env.PORT || 8000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const db = client.db("HotelBookingApp");
    const roomsCollection = db.collection("rooms");
    const usersCollection = db.collection("users");
    const bookingsCollection = db.collection("bookings");

    // Verify admin middkeware
    const verifyAdmin = async (req, res, next) => {
      const user = req.user;
      const query = { email: user.email };
      const result = await usersCollection.findOne(query);
      if (!result || result?.role !== "admin")
        return res.status(401).send({ message: "Unauthorize access" });
      next();
    };

    // Verify Host middkeware
    const verifyHost = async (req, res, next) => {
      const user = req.user;
      const query = { email: user.email };
      const result = await usersCollection.findOne(query);
      if (!result || result?.role !== "host")
        return res.status(401).send({ message: "Unauthorize access" });
      next();
    };

    // auth related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "24h",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // Logout
    app.get("/logout", async (req, res) => {
      try {
        res
          .clearCookie("token", {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send({ success: true });
        console.log("Logout successful");
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // create-payment-intent
    app.post("/create-payment-intent", verifyToken, async (req, res) => {
      const price = req.body.price;
      const priceInCent = parseFloat(price) * 100;

      if (!price || priceInCent < 1) return;
      // generate clientSecret
      const { client_secret } = await stripe.paymentIntents.create({
        amount: priceInCent,
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });
      // send client secret as response
      res.send({ clientSecret: client_secret });
    });

    // save User data in db
    app.put("/user", async (req, res) => {
      const user = req.body;
      const options = { upsert: true };
      const query = { email: user?.email };
      // check if user already exists in db
      const isExist = await usersCollection.findOne(query);
      if (isExist) {
        if (user.status === "Requested") {
          const result = await usersCollection.updateOne(query, {
            $set: { status: user?.status },
          });
          return res.send(result);
        } else {
          return res.send(isExist);
        }
      }

      // save user for the first tiem
      const updateDoc = {
        $set: {
          ...user,
          timestamp: Date.now(),
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // get a user
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection.findOne({ email });
      res.send(result);
    });

    // get all users data from db
    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // Update a User role
    app.patch("/users/update/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email };
      const updateDoc = {
        $set: {
          ...user,
          timestamp: Date.now(),
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // Get all Rooms
    app.get("/rooms", async (req, res) => {
      const category = req.query.category;
      let query = {};
      if (category && category !== "null") query = { category };
      const result = await roomsCollection.find(query).toArray();
      res.send(result);
    });

    // Get all room  for host
    app.get(
      "/my-listings/:email",
      verifyToken,
      verifyHost,
      async (req, res) => {
        const email = req.params.email;
        const query = { "host.email": email };
        const result = await roomsCollection.find(query).toArray();
        res.send(result);
      }
    );

    // delete a room
    app.delete("/room/:id", verifyToken, verifyHost, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollection.deleteOne(query);
      res.send(result);
    });

    // Post save Room
    app.post("/room", verifyToken, verifyHost, async (req, res) => {
      const roomData = req.body;
      const result = await roomsCollection.insertOne(roomData);
      res.send(result);
    });

    // Post save a booking
    app.post("/booking", verifyToken, async (req, res) => {
      const bookingData = req.body;
      const result = await bookingsCollection.insertOne(bookingData);
      res.send(result);
    });

    // update room Status
    app.patch("/room/status/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      // chsnge roon availablity status
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { booked: status },
      };
      const result = await roomsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // Update room data
    app.put('/room/update/:id', verifyToken, verifyHost, async (req, res) => {
      const id = req.params.id
      const roomData = req.body
      const query = { _id: new ObjectId(id)}
      const updateDoc = {
         $set: roomData, 
      }
      const result = await roomsCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    // get all booling for a guest depend on a guest email
    app.get("/my-bookings/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { "guest.email": email };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    // get all booling for a Host depend on a host email
    app.get(
      "/manage-bookings/:email",
      verifyToken,
      verifyHost,
      async (req, res) => {
        const email = req.params.email;
        const query = { "host.email": email };
        const result = await bookingsCollection.find(query).toArray();
        res.send(result);
      }
    );

    // Delete booking
    app.delete("/booking/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });

    // get a single room data from db using _ID
    app.get("/room/:roomId", async (req, res) => {
      const id = req.params.roomId;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollection.findOne(query);
      res.send(result);
    });

    // Save or modify user email, status in DB
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const isExist = await usersCollection.findOne(query);
      console.log("User found?----->", isExist);
      if (isExist) return res.send(isExist);
      const result = await usersCollection.updateOne(
        query,
        {
          $set: { ...user, timestamp: Date.now() },
        },
        options
      );
      res.send(result);
    });

    // Admin Statistics
    app.get("/admin-stat", verifyToken, verifyAdmin, async (req, res) => {
      // get bookingDtail
      const bookingDetails = await bookingsCollection
        .find(
          {},
          {
            projection: {
              date: 1,
              price: 1,
            },
          }
        )
        .toArray();

      // get total user
      const totalUser = await usersCollection.countDocuments();
      // get total rooms
      const totalRooms = await roomsCollection.countDocuments();
      // calculet totoalPrice
      const totalSales = bookingDetails.reduce(
        (sum, booking) => sum + booking?.price, 0
      );
      // data chart create
      const chartData = bookingDetails.map(booking => {
        const day = new Date(booking?.date).getDate()
        const month = new Date(booking?.date).getMonth() + 1
        const data =  [`${day}/${month}`, booking?.price]
        return data
      })
      chartData.unshift(['Day', 'Sales'])
     
      res.send({
        totalUser,
        totalRooms,
        totalBookings: bookingDetails.length,
        totalSales,
        chartData
      });
    });

    // Host statistics 
    app.get("/host-stat", verifyToken, verifyHost, async (req, res) => {
      const { email } = req.user

      // get bookingDtail
      const bookingDetails = await bookingsCollection
        .find(
          {'host.email': email},
          {
            projection: {
              date: 1,
              price: 1,
            },
          }
        )
        .toArray();

      // get total rooms
      const totalRooms = await roomsCollection.countDocuments({'host.email': email});
      // calculet totoalPrice
      const totalSales = bookingDetails.reduce(
        (sum, booking) => sum + booking?.price, 0
      );

      // Only host timestamp get UsersColection
      const { timestamp } = await usersCollection.findOne({email}, { projection: {timestamp: 1}} )

      // data chart create
      const chartData = bookingDetails.map(booking => {
        const day = new Date(booking?.date).getDate()
        const month = new Date(booking?.date).getMonth() + 1
        const data =  [`${day}/${month}`, booking?.price]
        return data
      })
      chartData.unshift(['Day', 'Sales'])
     
      res.send({
        totalRooms,
        totalBookings: bookingDetails.length,
        hostSince: timestamp,
        totalSales,
        chartData,
      });
    });

    // Guest Statistics 
    app.get("/guest-stat", verifyToken, async (req, res) => {
      const { email } = req.user

      // get bookingDtail
      const bookingDetails = await bookingsCollection
        .find(
          {'guest.email': email},
          {
            projection: {
              date: 1,
              price: 1,
            },
          }
        )
        .toArray();

      // calculet totalSpan
      const totalSpan = bookingDetails.reduce(
        (sum, booking) => sum + booking?.price, 0
      );

      // Only guest timestamp get UsersColection
      const { timestamp } = await usersCollection.findOne({email}, { projection: {timestamp: 1}} )

      // data chart create
      const chartData = bookingDetails.map(booking => {
        const day = new Date(booking?.date).getDate()
        const month = new Date(booking?.date).getMonth() + 1
        const data =  [`${day}/${month}`, booking?.price]
        return data
      })
      chartData.unshift(['Day', 'Span'])
     
      res.send({
        totalBookings: bookingDetails.length,
        guestSince: timestamp,
        totalSpan,
        chartData,
      });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from StayVista Server..");
});

app.listen(port, () => {
  console.log(`StayVista is running on port ${port}`);
});
