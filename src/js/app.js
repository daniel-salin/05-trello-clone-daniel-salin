import $ from 'jquery';

require('webpack-jquery-ui');
import '../css/styles.css';

/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function () {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $('.board');
    DOM.$listDialog = $('#list-creation-dialog');
    DOM.$columns = $('.column');
    DOM.$lists = $('.list');
    DOM.$cards = $('.cards');
    DOM.$editCards = $('.cards > .cards-content');

    DOM.$newListButton = $('button#new-list');
    DOM.$deleteListButton = $('.list-header > button.delete');

    DOM.$datepickerSubmit = $('.datepickerBtn');

    DOM.$newCardForm = $('form.new-card');
    DOM.$deleteCardButton = $('.cards > button.delete');
  }

  function countColumns() {
    let array = $('.column');
    return array.length - 1;
  }

  function createTabs() {
    let cardDialogTabs = $('#tabs');
    cardDialogTabs.tabs();
  }

  function createDatepicker() {
    let datepickerInput = $('.datepick');
    datepickerInput.datepicker();
  }

  function createDialogs() {
    let maxLists = $(`<div id="maxBoardsDialog"><span>Only 5 boards at a time</span></div>`);
    maxLists.dialog({
      modal: true,
      autoOpen: false,
      show: {
        effect: 'bounce',
        times: 5,
        duration: 1000,
        distance: 300
      },
      hide: {
        effect: 'explode',
        duration: 1000
      }
    });

    let cardDialog = $('#cardDialog');
    cardDialog.dialog({
      modal: true,
      autoOpen: false,
      show: {
        effect: 'bounce',
        times: 5,
        duration: 1000,
        distance: 300
      },
      hide: {
        effect: 'explode',
        duration: 1000
      }
    });
  }

  function makeSortable() {
    $('.list-cards').sortable({
      connectWith: ".list-cards"
    });
    $('.board').sortable({
      axis: "x"
    });
  }

  function editCard() {
    $('#cardDialog').dialog('open');
  }

  /*
   *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
   *  createList, deleteList, createCard och deleteCard etc.
   */
  function bindEvents() {
    DOM.$newListButton.on('click', createList);
    DOM.$deleteListButton.on('click', deleteList);
    DOM.$datepickerSubmit.on('click', datepickerSubmit);
    DOM.$editCards.on('click', editCard);

    DOM.$newCardForm.on('submit', createCard);
    DOM.$deleteCardButton.on('click', deleteCard);
  }


  /* ============== Metoder för att hantera jQuery UI widgets nedan ============== */
  function datepickerSubmit() {
    event.preventDefault();
    let datepickerDate = $('input[name="cardDate"]').val();
    console.log(datepickerDate);
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  // Denna metod 
  function createList() {
    event.preventDefault();
    let count = jtrello.countColumns();
    if (count >= 5) {
      $('#maxBoardsDialog').dialog('open');

    } else {
      let clonedList = DOM.$columns.last().prev().clone(false, false);
      clonedList.show();

      // Bind events och sortable
      clonedList.find('.list-cards').sortable({
        items: "> li",
        connectWith: '.list-cards'
      });
      clonedList.find('.list-header > button.delete').on('click', deleteList);
      clonedList.find('.cards > .cards-content').on('click', editCard);
      clonedList.find('form.new-card').on('click', createCard)
      clonedList.find('.cards > button.delete').on('click', deleteCard);

      clonedList.insertBefore(DOM.$board.find('.column').last());
    }
  }

  // Behåller en kolumn som clone-template i createList-metoden
  function deleteList() {
    let count = jtrello.countColumns() - 1;
    if (count < 1) {
      $(this).closest('.column').hide();
    } else {
      $(this).closest('.column').remove();
    }
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();

    let x = $(this).closest('.list-cards').children('.cards');

    let newCard = $(`<li class="cards my-3">
    <div class="cards-content"> New Card</div>
    <button class="button delete">X</button>
</li>`);
    newCard.sortable({
      items: "> li",
      connectWith: ".list-cards"
    });

    newCard.find('.cards-content').on('click', editCard);
    newCard.find('.button.delete').on('click', deleteCard);
    newCard.appendTo($(this).closest('.list-cards'));
  }

  function deleteCard() {
    event.preventDefault();
    $(this).closest('.cards').remove();
  }



  // Metod för att rita ut element i DOM:en
  function render() {}

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log(':::: Initializing JTrello ::::');
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    createDialogs();
    makeSortable();
    createDatepicker();
    bindEvents();
  }

  // All kod här
  return {
    init: init,
    countColumns: countColumns
  };
})();

//usage
$("document").ready(function () {
  jtrello.init();
});