
module.exports = {
  accumHourly: function (date, location, accum) {
    this.dateTime = date;
    this.location = location;
    this.value = accum;
  },
  Hourly: function (date, location, consumption) {
    this.dateTime = date;
    this.location = location;
    this.value = consumption;
  }

}