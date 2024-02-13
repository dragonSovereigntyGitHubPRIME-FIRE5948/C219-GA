import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
  collection,
  doc,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

$(document).ready(function () {

  const colorPrimary = '#ED5D15';
  const colorSecondary = '#003060';
  const colorBackground = '#F6EEE1';
  const colorOnPrimary = '#F6EEE1';
  const colorOnSecondary = '#ED5D15';
  const colorOnBackground = '#003060';

  /* CHART JS
------------------------------------------------------------------------------------------------------ */

  // Change default text color for Chart JS
  Chart.defaults.color = colorOnBackground;
  Chart.defaults.font.family = "Times New Roman"

  const labels = ['Fantasy', 'Children', 'Food', 'Science'];

  const data = {
    labels: labels,
    datasets: [{
      // label: 'My First Dataset', 
      backgroundColor: colorSecondary,
      // borderColor: 'rgb(255, 99, 132)', 
      data: [465, 408, 323, 264],
    }],
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      // hide background grids
      scales: {
        x: {
          grid: {
            drawOnChartArea: false
          }
        },
        y: {
          grid: {
            drawOnChartArea: false
          }
        }
      },
      // hide labl
      plugins: {
        legend: {
          display: false
        }
      }
    }
  };

  const myChart = new Chart(document.getElementById('Dashboard__Bar-Chart'), config);


  /* Title Chart --- Top Rating
  ------------------------------------------------------------------------------------------------------ */
  // const label__topRatingTitles = [
  //   'A Game of Thrones',
  //   'The Winds of Winter',
  //   'Fire & Blood',
  //   'Mockingjay',
  //   'Goblet of Fire',
  //   'The Kingdom of Fantasy',
  //   'A Storm of Swords',
  //   'The Chamber of Secrets'
  // ];

  // const data__topRatingTitles = {
  //   labels: label__topRatingTitles,
  //   datasets: [{
  //     backgroundColor: colorSecondary,
  //     // borderColor: 'rgb(255, 99, 132)', 
  //     data: [4.95, 4.83, 4.76, 4.72, 4.44, 4.40, 4.21, 4.1],
  //   }],
  // };

  // const config__topRatingTitles = {
  //   type: 'bar',
  //   data: data__topRatingTitles,
  //   options: {
  //     indexAxis: 'y', // <-- here
  //     responsive: true,
  //     // hide label
  //     plugins: {
  //       legend: {
  //         display: false
  //       }
  //     }
  //   }
  // };

  // new Chart(document.getElementById('Titles__Top-Rating'), config__topRatingTitles);

  /* Title Chart --- Oldest
  ------------------------------------------------------------------------------------------------------ */
  const label__topRatingTitles = [
    'A Game of Thrones',
    'The Winds of Winter',
    'Fire & Blood',
    'Mockingjay',
    'Goblet of Fire',
    'The Kingdom of Fantasy',
    'A Storm of Swords',
    'The Chamber of Secrets'
  ];

  const data__topRatingTitles = {
    labels: label__topRatingTitles,
    datasets: [{
      backgroundColor: colorSecondary,
      // borderColor: 'rgb(255, 99, 132)', 
      data: [4.95, 4.83, 4.76, 4.72, 4.44, 4.40, 4.21, 4.1],
    }],
  };

  const config__topRatingTitles = {
    type: 'bar',
    data: data__topRatingTitles,
    options: {
      indexAxis: 'y', // <-- here
      responsive: true,
      // hide label
      plugins: {
        legend: {
          display: false
        }
      }
    }
  };

  new Chart(document.getElementById('Titles__Top-Rating'), config__topRatingTitles);

  /* ******************************************************************************************************************* */
  /******************************************************* FIREBASE *******************************************************/
  /* ******************************************************************************************************************* */

  // Config.
  const firebaseConfig = {
    apiKey: "AIzaSyAwSsC_U3e5JixXa7fBLhB0lj6zROPvd-g",
    authDomain: "school-library-webapp-c219-ga.firebaseapp.com",
    projectId: "school-library-webapp-c219-ga",
    storageBucket: "school-library-webapp-c219-ga.appspot.com",
    messagingSenderId: "1045500833020",
    appId: "1:1045500833020:web:56ee9dd540cd4b6a99fb79",
    measurementId: "G-4QX9CQNZHM"
  };

  // Initialize.
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  /* Add Book.
  ------------------------------------------------------------------------------------------------------ */
  async function addBookToFirestore() {

    $("#add").on("click", async function () {

      var title = $('#title').val();
      var genre = $('#genre').val();
      var desc = $('#desc').val();
      var author = $('#author').val();
      var coverType = $('#cover-type').val();

      var bookmark = $('#bookmark').is(":checked");

      var language = $('#language').val();
      var reviews = $('#reviews').val();
      var pages = $('#pages').val();


      var ratings = $('#ratings').val();
      var rentStatus = $('#rent-status').is(":checked");

      var rentalDate;
      var pubDate;

      if ($("#rental-date").val() == "") {
        rentalDate = null;
      }
      else {
        rentalDate = Timestamp.fromDate(new Date($('#rental-date').val() + ""));
      }

      if ($("#pub-date").val() == "") {
        pubDate = null;
      }
      else {
        pubDate = Timestamp.fromDate(new Date($('#pub-date').val() + ""));
      }


      await addDoc(collection(db, "books"), {
        title: title,
        genre: genre,
        description: desc,
        author: author,
        cover_type: coverType,
        bookmark: bookmark,
        language: language,
        number_of_reviews: reviews,
        pages: pages,
        ratings: ratings,
        rent_status: rentStatus,
        rental_date: rentalDate,
        publication_date: pubDate,
      });
    });
  }


  $(function () {
    var book = $('#book');
    $('#view-cover').click(function () {
      $(this).addClass('cur').siblings().removeClass('cur');
      book.removeClass().addClass('view-cover');
    });
    $('#view-back').click(function () {
      $(this).addClass('cur').siblings().removeClass('cur');
      book.removeClass().addClass('view-back');
    });
    $('#open-book').click(function () {
      if (book.attr('class') != 'open-book') {
        $(this).addClass('cur').siblings().removeClass('cur');
        book.removeClass().addClass('open-book');
      } else {
        $(this).removeClass('cur');
        $('#view-cover').addClass('cur');
        book.removeClass().addClass('view-cover');
      }
    });
    $('#view-rotate').click(function () {
      $(this).addClass('cur').siblings().removeClass('cur');
      book.removeClass().addClass('view-rotate');
    });
  });

  var book = $('#book');
  book.removeClass().addClass('view-rotate');





  /* Book Display View Function
  ------------------------------------------------------------------------------------------------------ */
  $('#Book-Display__List-View').click(function () {
    $('.tab-content').addClass('list');
    $('.tab-content').find('*').addClass('list');
    $('.tab-options__select-hide').css("display", "flex");

    $('.tab-options__view-icon').removeClass('active');
    $(this).addClass('active');

    const arrayNewNumbers = [9, 12, 15, 18, 21];

    $('#pagination__options').find('option').each(function (index) {
      $(this).text(arrayNewNumbers[index]);
      $(this).val(arrayNewNumbers[index]);
    });
  });

  $('#Book-Display__Grid-View').click(function () {
    $('.tab-content').removeClass('list');
    $('.tab-content').find('*').removeClass('list');
    $('.tab-options__select-hide').css("display", "none");

    $('.tab-options__view-icon').removeClass('active');
    $(this).addClass('active');

    const arrayNewNumbers = [8, 12, 16];

    $('#pagination__options').find('option').each(function (index) {
      $(this).text(arrayNewNumbers[index]);
      $(this).val(arrayNewNumbers[index]);
    });
  });


  //   <select id="pagination__options">
  //   <option value="8">8</option>
  //   <option value="12">12</option>
  //   <option value="16">16</option>
  // </select>

  /* ******************************************************************************************************************* */
  /******************************************************** NAVBAR ********************************************************/
  /* ******************************************************************************************************************* */

  /* Top Nav
  ------------------------------------------------------------------------------------------------------ */
  const home = "Home"
  const statistics = "Statistics"
  const inventory = "Inventory"

  $(".nav__link").click(function () {
    var sectionToScroll = "#section__"
    var clickedNav = $(this).text(); // get the clicked nav item

    if (clickedNav == home) {
      sectionToScroll += "home"
    }
    else if (clickedNav == statistics) {
      sectionToScroll += "statistics"
    }
    else if (clickedNav == inventory) {
      sectionToScroll += "inventory"
    }
    scrollToSection(sectionToScroll);
  });

  function scrollToSection(sectionToScroll) {
    $('html, body').animate({
      scrollTop: $(sectionToScroll).offset().top
    }, 700);
  }

  /* Dot Nav
  ------------------------------------------------------------------------------------------------------ */
  const sectionHome = document.getElementById('section__home');
  const sectionStatistics = document.getElementById('section__statistics');
  const sectionInventory = document.getElementById('section__inventory');
  const dot1 = document.getElementsByClassName("dot-wrapper")[0];
  const dot2 = document.getElementsByClassName("dot-wrapper")[1];
  const dot3 = document.getElementsByClassName("dot-wrapper")[2];

  // When element scrolled to
  function elementScrolledTo(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top;
    return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
  }

  // When element comes into view
  const elementInView = (element) => {
    const rect = element?.getBoundingClientRect()

    if (!rect) return
    return rect.top <= window.innerHeight && rect.bottom >= 0
  }

  // Set dot nav UI.
  function setDotNav(dot) {
    $(".dot-wrapper.active").removeClass("active")
    $(dot).addClass("active")
  }

  // Set dot nav on load or refresh.
  function setDotNavOnLoad() {
    if (elementInView(sectionHome)) {
      setDotNav(dot1);
    }
    else if (elementInView(sectionStatistics)) {
      setDotNav(dot2);
    }
    else if (elementInView(sectionInventory)) {
      setDotNav(dot3);
    }
  }

  // Set dot nav UI when scorlling.
  $(window).scroll(function () {
    if (elementInView(sectionHome)) {
      setDotNav(dot1);
    }
    else if (elementInView(sectionStatistics)) {
      setDotNav(dot2);
    }
    else if (elementInView(sectionInventory)) {
      setDotNav(dot3);
    }
  });

  $(".dot-wrapper").click(function () {

    var sectionToScroll = "#section__"
    var dot;
    var index = $(this).index(); // get index of dot array

    if (index == 0) {
      sectionToScroll += "home"
      dot = dot1;
    }
    else if (index == 1) {
      sectionToScroll += "statistics"
      dot = dot2;
    }
    else if (index == 2) {
      sectionToScroll += "inventory"
      dot = dot3;
    }
    scrollToSection(sectionToScroll);
  });

  setDotNavOnLoad();



  /* ******************************************************************************************************************* */
  /******************************************************* FIREBASE *******************************************************/
  /* ******************************************************************************************************************* */
  const tabContent = $(".tab-content");
  // Item nodes.
  let bookItems = $('.tab-content__item');
  // No. of items.
  let numberOfItems = bookItems.length;
  // Pagination limit.
  let paginationLimit = 8;
  // Total pages.
  let totalPages = Math.ceil(numberOfItems / paginationLimit);
  // Current page.
  let currentPage = 0;
  // Pagination navigations.
  const paginationNumbers = $('.pagination__nav-numbers');
  // Item indexes.
  let arrayIndexesPerPage = [];

  async function getBooksAndPopulate() {

    // Data snapshot.
    const querySnapshot = await getDocs(collection(db, "books"));
    // Dataset for DataTable.
    const arrayDataSet = [];

    querySnapshot.forEach((doc) => {

      var arrayData = [];

      var title = doc.data().title;
      var genre = doc.data().genre;
      var author = doc.data().author;
      var language = doc.data().language;
      var ratings = doc.data().ratings;
      var numOfReviews = doc.data().number_of_reviews;
      var numOfPages = doc.data().pages;
      var rentStatus = doc.data().rent_status;
      var publicationDate = doc.data().publication_date;
      var rentalDate = doc.data().rental_date;
      var coverType = doc.data().cover_type;
      // var bookmarked = doc.data().bookmark;
      // var desc = doc.data().description;
      // var group = doc.data().group;
      var imageURL = doc.data().image_URL;

      var formatPubDate;
      var formatRentDate;

      if (publicationDate != null) {
        publicationDate = publicationDate.toDate();

        formatPubDate =
          publicationDate.getFullYear() + "-" +
          (publicationDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
          publicationDate.getDate().toString().padStart(2, '0');
      }
      else {
        formatPubDate = publicationDate + "";
      }
      if (rentalDate != null) {
        rentalDate = rentalDate.toDate();

        formatRentDate =
          rentalDate.getFullYear() + "-" +
          (rentalDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
          rentalDate.getDate().toString().padStart(2, '0');
      }
      else {
        formatRentDate = rentalDate + "";
      }

      //

      // Push data into data array.
      arrayData.push(imageURL, title, author, genre, language, numOfPages, coverType, formatPubDate, ratings, numOfReviews, rentStatus, formatRentDate);
      arrayDataSet.push(arrayData);

      var tabContentItem =
        `
        <div class="tab-content__item" 
        data-title="`+ title + `"
        data-genre="`+ genre + `"
        data-author="`+ author + `"
        data-language="`+ language + `"
        data-ratings="`+ ratings + `"
        data-reviews="`+ numOfReviews + `"
        data-pages="`+ numOfPages + `"
        data-publication-date-format="`+ formatPubDate + `"
        data-publication-date="`+ publicationDate + `"
        >
          <div class="tab-content__item-book">

            <!-- reservation status -->
            <div class="tab-content__item-book-reservation `+ rentStatus + `">
              <span class="background flex-center-all"><h5>Reserved</h5></span>
              <span class="wrap"></span>
            </div>

            <!-- engagements -->
            <div class="tab-content__item-book-engagements flex flex-column">
              <div class="`+ rentStatus + `"><span class="tab-content__item-unreserve"><i class="fa-solid fa-xmark"></i></span></div>
              <div><span><i class="fa-solid fa-bookmark"></i></span></div>
              <div><span><i class="fa-solid fa-share"></i></span></div>
            </div>

            <!-- book -->
            <div class="book">
              <div class="image-wrapper">
                  <img loading="lazy" src="./images/covers-front/`+ imageURL + `.webp" alt="Book Image">
              </div>
            </div>
          </div>

          <div class="tab-content__item-content">
            <p class="p-subtitle">`+ genre + `</p>
            <p class="p-title">`+ title + `</p>
            <h6>`+ author + `</h6>
            <button class="tab-content__item-reserve `+ rentStatus + `">Reserve</button>
          </div>
        </div>
      `;

      tabContent.append(
        tabContentItem
      );
    });

    bookItems = $('.tab-content__item');
    // No. of items.
    numberOfItems = bookItems.length;
    // Pagination limit.
    paginationLimit = 8;
    // Total pages.
    totalPages = Math.ceil(numberOfItems / paginationLimit);
    // Current page.
    currentPage = 0;
    // Item indexes.
    arrayIndexesPerPage = [];

    listenerReservation();

    setUpPagination();

    handleGoToPage();
    handleGoToPageText(totalPages);
    handlePaginationTextForTotalItems();

    new DataTable('#Inventory-DataTable', {
      columns: [
        {
          title: 'Cover',
          data: null,
          render: function (data, type, row, meta) {
            return '<img loading="lazy" class="datatable__image" src="images/covers-front/' + arrayDataSet[meta.row][0] + '.webp" alt="' + arrayDataSet[meta.row][1] + '">';
          }
        },
        { title: 'Title' },
        { title: 'Author' },
        { title: 'Genre' },
        { title: 'Language' },
        { title: 'Pages' },
        { title: 'Type' },
        { title: 'Publication' },
        { title: 'Ratings' },
        { title: 'Reviews' },
        {
          title: 'Rental',
          data: null,
          render: function (data, type, row, meta) {

            if (arrayDataSet[meta.row][10] === true) {
              return '<p style="color: red">Rented</p>';
            }
            else {
              return '<p style="color: green">Open</p>';
            }
          }
        },
        { title: 'Rental Date' },
      ],
      data: arrayDataSet,
      // configs
      pageLength: 5
      ,
      fixedColumns: {
        left: 1,
        right: 1
      },
      scrollX: true,
      scrollCollapse: true,
      paging: true,
      // autoWidth: false,
    });
  }

  // getBooksAndPopulate()



  // table.on('mouseenter', 'td', function () {
  //   let colIdx = table.cell(this).index().column;

  //   table
  //     .cells()
  //     .nodes()
  //     .each((el) => el.classList.remove('highlight'));

  //   table
  //     .column(colIdx)
  //     .nodes()
  //     .each((el) => el.classList.add('highlight'));
  // });

  // table.on('click', 'tbody tr', function (e) {
  //   e.currentTarget.classList.toggle('selected');
  // });

  // document.querySelector('#button').addEventListener('click', function () {
  //   alert(table.rows('.selected').data().length + ' row(s) selected');
  // });

  /* ******************************************************************************************************************* */
  /****************************************************** SECTION 1 ******************************************************/
  /* ******************************************************************************************************************* */

  let tabContentItemHeight = $('h4').height();

  $(".tab-content__item h4").each(function () {
    if ($(this).height() > tabContentItemHeight) {
      // $(this).width();
      // $(this).text('ffff')
      // const t = $(this).text()+"";
      // const limit = 
      $(this).text($(this).text().slice(0, 10) + "...");
    }
  });

  function listenerReservation() {
    // Reserve Button.
    $(".tab-content__item-reserve").click(function () {
      // disable reserve button.
      $(this).text('Reserved').prop('disabled', true).addClass('true');
      // add unreserve button.
      $(this).parents(".tab-content__item").find('.tab-content__item-unreserve').parent().removeClass('false');
      // add banner.
      $(this).parents(".tab-content__item").find('.tab-content__item-book-reservation').removeClass('false').addClass('true');
      // get title.
      var title = $(this).parents().find('.tab-content__item').attr('data-title');
      // alert
      // alert(title + " Reserved.")
    });

    // Unreserve Button.
    $(".tab-content__item-unreserve").click(function () {
      // enable reserve button.
      $(this).parents('.tab-content__item').find('.tab-content__item-reserve').prop('disabled', false).removeClass('true');
      // remove unreserve button.
      $(this).parent().addClass('false');
      // remove banner.
      $(this).parents(".tab-content__item").find('.tab-content__item-book-reservation').removeClass('true').addClass('false');
      // get title.
      var title = $(this).parents().find('.tab-content__item').attr('data-title');
      // alert.
      // alert(title + " Unreserved.")
    });
  }

  /* = PAGINATION
  ------------------------------------------------------------------------------------------------------ */
  // Set pagination button by current page.
  function setActivePaginationButton(pageNumber) {
    $(".pagination-button").removeClass('active');
    $(".pagination-button").eq(pageNumber).addClass('active');
  }

  // Set content for page.
  function setPaginationPage(pageNumber) {
    // change global variable.
    currentPage = pageNumber;
    // get the set of indexes for the page.
    const arrayItemsToShow = arrayIndexesPerPage[pageNumber];
    // hide all items.
    $(".tab-content__item").hide().removeClass('animate');
    // show items.
    for (let i = 0; i < arrayItemsToShow.length; i++) {
      $(".tab-content__item").eq(arrayItemsToShow[i]).show().addClass('animate');
    }
    // change active button.
    setActivePaginationButton(pageNumber);
    // handle arrow status.
    handlePaginationArrowStatus();
    // handle showing item range text.
    handlePaginationTextForShowRange(arrayItemsToShow);
    // handle 'Go to page' value.
    handleGoToPageValue(pageNumber + 1);
  }

  // Set pagination indexes.
  function setPagination() {
    var arrayTemp = [];
    // reset the index array.
    arrayIndexesPerPage = [];

    for (let n = 0; n < numberOfItems; n++) {
      // push indexes.
      arrayTemp.push(n);
      // when hit pagination limit, add array to parent array and reset array.
      if (Number.isInteger((n + 1) / paginationLimit)) {
        arrayIndexesPerPage.push(arrayTemp);
        arrayTemp = [];
      }
      // when reach last item, add array to parent to array.
      if (n >= numberOfItems - 1) {
        arrayIndexesPerPage.push(arrayTemp);
      }
    }

    // set page
    //set button
    if (currentPage + 1 > totalPages) {
      setPaginationPage(0);
    }
    else {
      setPaginationPage(currentPage);
    }
    setPaginationButtons();
  }

  // Handle pagination button status.
  function setPaginationButtons() {
    // remove all prior buttons.
    $('.pagination-button').remove();
    // add button for each page.
    for (let i = 0; i < totalPages; i++) {
      var pageButton = document.createElement("button");
      pageButton.className = "pagination-button" // add class
      pageButton.textContent = i + 1 + "";
      paginationNumbers.append(pageButton);
    }
  }

  // Buttons //
  // Handle pagination button click. 
  function listenerPaginationButton() {
    $(".pagination-button").on("click", function () {
      // get index of button
      currentPage = $(".pagination-button").index(this);
      // get the pagination container by index of button and add 'active' class.
      setPaginationPage(currentPage);
      // scroll up on change.
      scrollToSection('#Book-Display');
    });
  }

  // Select //
  // Handle option select for display number of items/
  function listenerSelectPaginationOption() {
    $("#pagination__options").on("change", function () {
      // get limit from option selected.
      paginationLimit = $("#pagination__options option:selected").val();
      // change global variable.
      totalPages = Math.ceil(numberOfItems / paginationLimit);

      // set the pagination.
      setPagination();
      // set new buttons.
      setPaginationButtons();
      // set button listener.
      listenerPaginationButton();
      // set the current page. if current page more than total no. of pages, set current page as last page.
      // if (currentPage + 1 > totalPages) {
      //   currentPage = totalPages;
      // }

      // set 'Go to page' text.
      handleGoToPageText(totalPages);

      // set the page.
      setPaginationPage(currentPage);
    })
  }

  // Disable select option if no. of items is less than option.
  function setPaginationSelect() {
    // disable all options
    $('#pagination__options').find('option').attr("disabled", true);
    $('#pagination__options').find('option').each(function () {
      // enable option per loop
      $(this).attr("disabled", false);
      // if option exceed number of current items, break loop
      if (numberOfItems < $(this).val()) {
        return false;
      }
    });
  }

  // Arrows //
  // Enable/Disable pagination arrows.
  function handlePaginationArrowStatus() {
    // first page.
    if (currentPage === 0) {
      togglePaginationButton($('.pagination__nav-button.prev'), false);
      togglePaginationButton($('.pagination__nav-button.next'), true);
    }
    // last page.
    else if (currentPage + 1 == totalPages) {
      togglePaginationButton($('.pagination__nav-button.next'), false);
      togglePaginationButton($('.pagination__nav-button.prev'), true);
    }
    // any other page.
    else {
      togglePaginationButton($('.pagination__nav-button'), true);
    }
  }

  function togglePaginationButton(button, toggle) {
    if (toggle == true) {
      button.prop('disabled', false);
    }
    else {
      button.prop('disabled', true);
    }
  }

  // Option Text //
  // Handle number range for items showing text.
  function handlePaginationTextForShowRange(arrayItemIndexes) {

    var range = (currentPage + 1) * paginationLimit;
    // first item index.    
    var start = range - paginationLimit + 1;
    // last item index.
    var end;
    if (numberOfItems < paginationLimit) {
      end = numberOfItems;
    }
    else {
      end = range;
    }

    if (currentPage + 1 === totalPages) {
      end = numberOfItems;
    }
    $('.pagination__number-of-items-text span:nth-child(1)').text(start + " - " + end);
  }

  // Handle 'total number of items' text.
  function handlePaginationTextForTotalItems() {
    $('.pagination__number-of-items-text span:nth-child(2)').text(numberOfItems);
  }

  // Go to page.
  function handleGoToPage() {
    // $('.tab-options__page-input input').val(pageNumber);
    $(".tab-options__page-input input").keypress(function (event) {
      if (event.which == 13) {
        var pageNumber = $('.tab-options__page-input input').val();

        if (pageNumber != currentPage + 1) {
          if (pageNumber <= totalPages) {
            scrollToSection('#Book-Display');
            setPaginationPage(pageNumber - 1);
          }
          else {
            alert('Out of bounds.');
            handleGoToPageValue(currentPage + 1);
          }
        }
      }
    });

    // revert back to current value if no event detected.
    $(".tab-options__page-input input").on("blur", function () {
      handleGoToPageValue(currentPage + 1);
    });
  }

  // Handle 'Go to page' events.
  function handleGoToPageValue(pageNumber) {
    $('.tab-options__page-input input').val(pageNumber);
  }

  // Change value of input.
  function handleGoToPageText(totalPages) {
    $('.tab-options__page-input p span').text(totalPages);
  }

  // Pagination set up.
  function setUpPagination() {
    setPagination();
    setPaginationButtons();
    setActivePaginationButton(currentPage);
    listenerPaginationButton();
    listenerSelectPaginationOption();
    setPaginationSelect();
  }

  $(".pagination__nav-button.prev").on("click", function () {
    // get index of button
    currentPage--;
    // get the pagination container by index of button and add 'active' class.
    setPaginationPage(currentPage);
    // scroll up on change.
    scrollToSection('#Book-Display');
  });

  $(".pagination__nav-button.next").on("click", function () {
    // get index of button
    currentPage++;
    // get the pagination container by index of button and add 'active' class.
    setPaginationPage(currentPage);
    // scroll up on change.
    scrollToSection('#Book-Display');
  });

  /* = SEARCH FUNCTION
  ------------------------------------------------------------------------------------------------------ */
  // Search
  $(".search-bar__button").on("click", function () {

    var input = $(".search-bar__input").val().trim().toLowerCase();

    $(".tab-content__item").hide().removeClass('animate');

    if (input.replaceAll(' ', '') === "") {
      // show all items if input is empty.
      $(".tab-content__item").show().addClass('animate');

      bookItems = $(".tab-content__item");
      numberOfItems = bookItems.length;
      totalPages = Math.ceil(numberOfItems / paginationLimit);

      setUpPagination();
    }

    arrayIndexesPerPage = [];
    var arrayTemp = [];

    $(".tab-content__item").each(function (index) {
      if (($(this).data("title").toLowerCase().includes(input))) {
        $(this).show();
        arrayTemp.push($(this).index())

        if (arrayTemp.length >= paginationLimit) {
          arrayIndexesPerPage.push(arrayTemp);
          arrayTemp = [];
        }
      }
      // when reach last item, add array to parent to array.
      if (index >= $(".tab-content__item").length - 1) {
        arrayIndexesPerPage.push(arrayTemp);
      }
    });

    bookItems = $(".tab-content__item:visible");
    numberOfItems = bookItems.length;
    totalPages = Math.ceil(numberOfItems / paginationLimit);

    if (currentPage + 1 > totalPages) {
      setPaginationPage(0);
    }
    else {
      setPaginationPage(currentPage);
    }
    setPaginationButtons();

    // setPaginationPage(currentPage)
    setPaginationButtons();
    setActivePaginationButton(currentPage);
    listenerPaginationButton();
    listenerSelectPaginationOption();
    setPaginationSelect();

    handleGoToPage();
    handleGoToPageText(totalPages);
    handlePaginationTextForTotalItems();
  });

  /* = SORT FUNCTION
  ------------------------------------------------------------------------------------------------------ */
  let sortedItems;

  $("#Sort-Options").on("change", function () {
    var sort = $("#Sort-Options option:selected").val();
    var thisTabContentItems = document.querySelectorAll('.tab-content__item');
    var arrayTabContentItems = Array.from(thisTabContentItems);

    // default pattern.
    if (sort === 'relevance') {
      $('.tab-content').append(bookItems);
    }
    // by publication date
    else if (sort === 'publication-date') {
      sortedItems = arrayTabContentItems.sort(
        (a, b) => {
          return (
            new Date($(a).attr('data-publication-date'))
              <
              new Date($(b).attr('data-publication-date')) ? -1 : 1 // ascending
          )
        }
      )
      $('.tab-content').append(sortedItems);
    }
    // by others.
    else {
      sortedItems = arrayTabContentItems.sort(
        (a, b) => {
          return (
            $(a).attr('data-' + sort)
              <
              $(b).attr('data-' + sort) ? -1 : 1 // descending
          )
        }
      )
      $('.tab-content').append(sortedItems);
    }
  })

  $(".tab-options__sort-order:not(:has(.active))").on("click", function () {
    // ascending
    if ($(this).hasClass('up')) {
      $(this).parent().find('.tab-options__sort-order.down').removeClass('active')
      $(this).addClass('active');

      sortedItems = sortedItems.sort()
      $('.tab-content').append(sortedItems);
    }

    // descending
    else if ($(this).hasClass('down')) {
      $(this).parent().find('.tab-options__sort-order.up').removeClass('active')
      $(this).addClass('active');

      sortedItems = sortedItems.sort().reverse()
      $('.tab-content').append(sortedItems);
    }
  });

  /* = FILTER FUNCTION
  ------------------------------------------------------------------------------------------------------ */
  let arrayFilters = [];

  $(".filter__select-button").on("click", function () {
    // filter.
    var filter = $(this).parent().find('select option:selected').val().toString();
    if (!arrayFilters.includes(filter)) {
      // filter item container.
      var filterContainer = $(this).closest('.select-container').find('.filter__select-chosen-container');
      // create filter item element.
      var filterItem = `<div data-filter="` + filter + `">` + filter + `<i class="fa-solid fa-xmark"></i></div>`;
      // append to container.
      filterContainer.append(filterItem);
      arrayFilters.push(filter);
    }
    else {
      alert(filter + " already added.");
    }

    listenerCancelFilterItem();
  });

  function listenerCancelFilterItem() {
    $(".filter__select-chosen-container > div").on("click", function () {
      var filter = $(this).data('filter');
      arrayFilters = arrayFilters.filter(function(e) { return e !== filter })
      $(this).remove();
    });
  }

  // $(".tab-content__item").each(function (index) {
  //   if (($(this).data("title").toLowerCase().includes(input))) {
  //     $(this).show();
  //     arrayTemp.push($(this).index())

  //     if (arrayTemp.length >= paginationLimit) {
  //       arrayIndexesPerPage.push(arrayTemp);
  //       arrayTemp = [];
  //     }
  //   }
  //   // when reach last item, add array to parent to array.
  //   if (index >= $(".tab-content__item").length - 1) {
  //     arrayIndexesPerPage.push(arrayTemp);
  //   }
  // });






  // Toggle menu on click









  $("#menu-toggler").click(function () {
    toggleBodyClass("menu-active");
  });

  function toggleBodyClass(className) {
    document.body.classList.toggle(className);
  }






  // Tippy JS
  tippy('.tab-content__item', {
    content(reference) {
      const id = reference.getAttribute('data-template');
      const template = document.getElementById(id);
      return template.innerHTML;
    },
    allowHTML: true,
    placement: 'right-start',
    arrow: true,
    animation: 'scale-extreme',
    interactive: true,
  });

  tippy('#Engagement-Unreserve', {
    content: "Unreserve the book.",
  });

  tippy('#okay', {
    content: "Save a book that caught your eye.",
  });

  tippy('#Engagement-Share', {
    content: "Share a book that you really like.",
  });

});