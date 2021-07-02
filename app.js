!(function (ctx) {
  ctx.COMMANDERS = ctx.COMMANDERS || [];
  const event = new Event('dataUpdate');

  const ELEMENTS = ['LIGHT', 'DARK', 'WATER', 'WIND', 'FIRE', 'EARTH', 'DIVINE']

  const showLoading = () => document.querySelector('.progress').classList.remove('hide')
  const hideLoading = () => document.querySelector('.progress').classList.add('hide')

  const renderCard = card => `<div class="col s12 m6">
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${card.id}.jpg">
      </div>
      <div class="card-content">
        <p class="card-title activator grey-text text-darken-4">${card.name}<i class="material-icons right">more_vert</i></p>
        <p><a onclick="document.dispatchEvent(new CustomEvent('searchThis', { detail: ${card.id} }));" href="#">Check out valid cards for this commander</a></p>
      </div>
      <div class="card-reveal">
        <h3 class="card-title grey-text text-darken-4">${card.name}<i class="material-icons right">close</i></h3>
        <div class="card__levels__wrapper">${new Array(card.level).fill(0).map(_ => '<img class="card__levels" src="star.png" />').join('')}</div>
        <p><strong>${card.race}</strong></p>
        <p>${card.desc}</p>
      </div>
    </div>
  </div>`

  const renderNormalCard = card => `<div class="col s12 m4">
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="https://storage.googleapis.com/ygoprodeck.com/pics/${card.id}.jpg">
      </div>
      <div class="card-content">
        <p class="card-title activator grey-text text-darken-4">${card.name}<i class="material-icons right">more_vert</i></p>
        <p><a onclick="document.dispatchEvent(new CustomEvent('searchThis', { detail: ${card.id} }));" href="#">Check out valid cards for this commander</a></p>
      </div>
      <div class="card-reveal">
        <h3 class="card-title grey-text text-darken-4">${card.name}<i class="material-icons right">close</i></h3>
        <div class="card__levels__wrapper">${new Array(card.level).fill(0).map(_ => '<img class="card__levels" src="star.png" />').join('')}</div>
        <p><strong>${card.race}</strong></p>
        <p>${card.desc}</p>
      </div>
    </div>
  </div>`

  // Listen for the event.
  document.addEventListener('dataUpdate', function (e) {
    buildCommanders()
    hideLoading()
  }, false);

  // Listen for the event.
  document.addEventListener('searchThis', function (e) {
    showLoading()
    fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?id=' + e.detail)
      .then(response => response.json())
      .then(({ data }) => {
        data = data[0]
        let validElements = ELEMENTS.map(w => data.desc.toLowerCase().search(w.toLowerCase()) > -1 ? w : false).filter(Boolean)
        validElements.push(data.attribute)
        console.log(validElements)
        return {validElements, race: data.race}
      })
      .then(({ validElements, race }) => {
        fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?attribute=' + validElements.join(',') + '&race=' + race)
          .then(response => response.json())
          .then(({ data }) => {
            document.querySelector('#commanders').classList.add('hide')
            document.querySelector('#cardlist').classList.remove('hide')
            document.querySelector('#cardlist .content').innerHTML = data.map(card => renderNormalCard(card)).join('')
            hideLoading()
          })
      })
  }, true);

  function buildCommanders () {
    document.querySelector('#commanders').innerHTML = ctx.COMMANDERS.map(card => renderCard(card)).join('')
  }

  // Dispatch the event.
  document.addEventListener("DOMContentLoaded", function () {
    fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?desc=Cannot%20be%20Normal&type=Effect%20Monster')
      .then(response => response.json())
      .then(({ data }) => {
        ctx.COMMANDERS = data
        document.dispatchEvent(event);
      })
  })
})(window)