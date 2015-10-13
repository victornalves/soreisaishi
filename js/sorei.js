/************************************************************************************************/
//
// Sorei Class
//
/************************************************************************************************/
var Sorei = function() {

  var dt_shinrei  = [10, 20, 30, 40, 50, 100]

  var dt_nensai   = [1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 50, 100]

  Sorei.prototype.data_cultos = {}

  Sorei.prototype.dt_falecimento = new Date('2015', '00', '01')

  Sorei.prototype.init = function( dt_falecimento ) {

    if( dt_falecimento != undefined )
    {
      this.dt_falecimento = new Date( dt_falecimento )
    }

    this.data_cultos.shinrei = this.calc_shinrei()
    this.data_cultos.nensai  = this.calc_nensai()

    console.log( this.data_cultos);

    console.log('Init Sorei')

  }

  Sorei.prototype.get_dates = function() {

      return this.data_cultos
  }

  Sorei.prototype.calc_shinrei = function() {

    var cultos_shinrei = new Date_Container()

    for (var i = 0; i < dt_shinrei.length; i++) {

      dias_offset = dt_shinrei[i]

      dt_culto = add_dias( dias_offset, this.dt_falecimento )

      cultos_shinrei.add_date( dt_culto )
    }

    return cultos_shinrei
  }

  Sorei.prototype.calc_nensai = function() {

    var cultos_nensai = new Date_Container()

    for (var i = 0; i < dt_nensai.length; i++) {

      anos_offset = dt_nensai[i]

      dt_culto = add_anos( anos_offset, this.dt_falecimento )

      cultos_nensai.add_date( dt_culto );

    }

    return cultos_nensai
  }


  var add_dias = function( dias_offset, dt_falecimento ) {

    dt_culto = new Date( dt_falecimento )

    dt_culto.setDate( dt_falecimento.getDate() + dias_offset - 1 )

    return dt_culto

  }

  var add_anos = function( anos_offset, dt_falecimento ) {

    ano_falecimento = dt_falecimento.getFullYear()

    dt_culto = new Date( dt_falecimento )

    dt_culto.setFullYear( ano_falecimento + anos_offset )

    return dt_culto

  }

  var format_data = function( date ){
    day   = date.getDate()
    month = date.getMonth() + 1
    year  = date.getFullYear()

    return month + '/' + day + '/' + year
  }

  this.init()

  console.log('Objeto Sorei instanciado')
}



/************************************************************************************************/
//
// Date Container Class
//
/************************************************************************************************/
 var Date_Container = function() {

   this.dates = []

   _year = function(year, months){
    this.year   = year,
    this.months = ( months.length == undefined ? [months] : months ) || []
   }

   _month = function(month, days){
    this.month = month,
    this.days = ( days.length == undefined ? [days] : days ) || []
   }
}

Date_Container.prototype.add_date = function( date ) {

  day   = date.getDate()
  month = date.getMonth() + 1
  year  = date.getFullYear()


  found_year = this.dates.find( function(e, i, a) { return e.year == this.year }, {year: year } )

  if( found_year == undefined )
  {
    this.dates.push( new _year( year, new _month( month, day )) )
  }
  else
  {
    found_month = found_year.months.find( function(e, i, a) { return e.month == this.month }, {month: month } )

    if( found_month == undefined )
    {
      found_year.months.push( new _month( month, day ))
    }
    else
    {
      found_month.days.push( day )
    }
  }

}

dates = new Date_Container()

dates.add_date( new Date( "01/01/2015" ))

/************************************************************************************************/
//
// Polyfills
//
/************************************************************************************************/

// Array Find
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
