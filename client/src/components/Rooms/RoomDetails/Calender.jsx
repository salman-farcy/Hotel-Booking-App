import { DateRange } from 'react-date-range'

const Calender = () => {
  return (
    <DateRange
          showDateDisplay={false}
          rangeColors={["#F6536D"]}
          editableDateInputs={true}
          onChange={(item) => setState([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={state}
        />
  )
}

export default Calender