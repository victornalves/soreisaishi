var Sorei = function() {

  var dt_shinrei = [10, 20, 30, 40, 50, 100]

  var dt_nensai = [1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 50, 100]

  Sorei.prototype.dt_falecimento = new Date('2015', '00', '01')

  Sorei.prototype.init = function( dt_falecimento ) {
    this.dt_falecimento = new Date( dt_falecimento )

    console.log('Init Sorei')
  }

  Sorei.prototype.calc_shinrei = function() {

    var cultos_shinrei = []

    for (var i = 0; i < dt_shinrei.length; i++) {

      dias_offset = dt_shinrei[i]

      dt_culto = add_dias( dias_offset, this.dt_falecimento )

      cultos_shinrei.push( dt_culto );
    }

    return cultos_shinrei
  }

  Sorei.prototype.calc_nensai = function() {

    var cultos_nensai = []

    for (var i = 0; i < dt_nensai.length; i++) {

      anos_offset = dt_nensai[i]

      dt_culto = add_anos( anos_offset, this.dt_falecimento )

      cultos_nensai.push( dt_culto );

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


  console.log('Objeto Sorei instanciado')
}
