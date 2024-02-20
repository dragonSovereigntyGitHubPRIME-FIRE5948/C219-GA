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
  // Elements.
  const tabContent = $(".tab-content");
  const bookmarkContainer = $('.bookmark-container');
  // Viewport Width
  let viewportWidth = $(window).width();
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
  // Default Array (for sorting).
  let domBookItems;
  let arrayDefaultSortedBookItems;

  const colorPrimary = '#ED5D15';
  const colorSecondary = '#003060';
  const colorBackground = '#F6EEE1';
  const colorOnPrimary = '#F6EEE1';
  const colorOnSecondary = '#ED5D15';
  const colorOnBackground = '#003060';

  const sectionHome = document.getElementById('section__home');
  const sectionStatistics = document.getElementById('section__statistics');
  const sectionInventory = document.getElementById('section__inventory');
  const sectionContact = document.getElementById('section__contact');
  const dot1 = document.getElementsByClassName("dot-wrapper")[0];
  const dot2 = document.getElementsByClassName("dot-wrapper")[1];
  const dot3 = document.getElementsByClassName("dot-wrapper")[2];
  const dot4 = document.getElementsByClassName("dot-wrapper")[3];

  // let sectionHomeAnim = false;
  let sectionStatsAnim = false;
  let sectionInventoryAnim = false;
  let sectionContactAnim = false;


  $(window).scroll(function () {

    if (elementCenterInView('#section__statistics')) {
      if (!sectionStatsAnim) {
        const section = '#section__statistics'
        $('#Tab-Dashboard').addClass('animate')
        $(section + '> .section-header hr').addClass('animate')
        $(section + '> .section-header .section-title').addClass('animate')
        $(section + '> .section-header .section-desc').addClass('animate')
        sectionStatsAnim = true;
      }
    }
    if (elementCenterInView('#section__inventory')) {

      if (!sectionInventoryAnim) {
        const section = '#section__inventory'
        $('#Tab-Dashboard').addClass('animate')
        $(section + '> .section-header hr').addClass('animate')
        $(section + '> .section-header .section-title').addClass('animate')
        $(section + '> .section-header .section-desc').addClass('animate')
        $(section + ' #Inventory-DataTable').addClass('animate')

        sectionInventoryAnim = true;
      }
    }
    if (elementCenterInView('#section__contact')) {
      if (!sectionContactAnim) {
        const section = '#section__contact'
        $('#Tab-Dashboard').addClass('animate')
        $(section + '> .section-header hr').addClass('animate')
        $(section + '> .section-header .section-title').addClass('animate')
        $(section + '> .section-header .section-desc').addClass('animate')
        $(section + ' .contact__text').addClass('animate')
        $(section + ' .contact__form').addClass('animate')
        sectionContactAnim = true;
      }
    }
  });

  /* CHART JS
  ------------------------------------------------------------------------------------------------------ */

  // Change default text color for Chart JS
  Chart.defaults.color = colorOnBackground;
  Chart.defaults.font.family = "Times New Roman"

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


  /* DASHBOARD CHARTS
  ------------------------------------------------------------------------------------------------------ */

  // 'Romance', 'Fantasy', 'Horror', 'Children', 'Science Fiction', 'Technology'
  var chartAnimation = {
    tension: {
      duration: 1000,
      easing: 'linear',
      from: 1,
      to: 0,
      loop: true
    }
  }

  /* BAR LINE
  ------------------------------------------------------------------------------------------------------ */
  const label__trendGenres = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec  '
  ];

  const data__trendGenres = {
    labels: label__trendGenres,
    datasets: [
      // dataset 1
      {
        backgroundColor: colorSecondary,
        data: [645, 346, 456, 298, 565, 673, 768, 356, 925, 1145, 953, 874],
        type: 'bar'
      },
      // dataset 2
      {
        backgroundColor: colorPrimary,
        borderColor: colorPrimary,
        data: [645, 346, 456, 298, 565, 673, 768, 356, 925, 1145, 953, 874],
        stack: 'combined'
      },
    ],
  };

  const config__trendGenres = {
    type: 'line',
    data: data__trendGenres,
    options: {
      animation: chartAnimation,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'No. of Reserved Books by Genre in 2023 (Fantasy)'
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          stacked: true
        }
      }
    }
  };

  new Chart(document.getElementById('Genre-Trend'), config__trendGenres);

  /* DOUGHNUT
  ------------------------------------------------------------------------------------------------------ */
  const label__doughnut = [
    'English', 'Spanish', 'Chinese', 'Malay', 'Tamil',
  ];

  const data__doughnut = {
    labels: label__doughnut,
    datasets: [{
      label: 'No. of Books',
      data: [380, 55, 126, 300, 236, 187],
      backgroundColor: [
        '#003060',
        '#19446F',
        '#32597f',
        '#2f567d',
        '#758ea8',
        '#a3b4c5'
      ],
      borderWidth: [0, 0, 0, 0],
      hoverOffset: 4
    }]
  };

  const config__doughnut = {
    type: 'doughnut',
    data: data__doughnut,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Language Distribution by No. of Books'
        },
      },
    }
  };

  new Chart(document.getElementById('Genre-Doughnut'), config__doughnut);

  /* POLAR AREA
  ------------------------------------------------------------------------------------------------------ */
  const label__polarArea = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May',
  ];

  const data__polarArea = {
    labels: label__polarArea,
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  const config__polarArea = {
    type: 'polarArea',
    data: data__polarArea,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'No. of Reserved Books by Genre in 2023 (Fantasy)'
        },
      },
    }
  };

  new Chart(document.getElementById('Genre-PolarArea'), config__polarArea);

  /* RADAR
  ------------------------------------------------------------------------------------------------------ */
  const label__radarGenre = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May',
  ];

  const data__radarGenre = {
    labels: label__radarGenre,
    datasets: [
      // dataset 1
      {
        backgroundColor: colorSecondary,
        data: [645, 346, 456, 298, 565, 673, 768, 356, 925, 1145, 953, 874],
      },
      // dataset 2
      {
        backgroundColor: colorPrimary,
        borderColor: colorPrimary,
        data: [645, 346, 456, 298, 565, 673, 768, 356, 925, 1145, 953, 874],
      },
    ],
  };

  const config__radarGenre = {
    type: 'radar',
    data: data__radarGenre,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'No. of Reserved Books by Genre in 2023 (Fantasy)'
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          stacked: true
        }
      }
    }
  };

  new Chart(document.getElementById('Genre-Radar'), config__radarGenre);

  /* SCATTER
  ------------------------------------------------------------------------------------------------------ */
  const label__scatterGenre = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May',
  ];

  const data__scatterGenre = {
    // labels: label__scatterGenre,
    datasets: [{
      label: 'Scatter',
      data:
        [{
          x: -10,
          y: 0
        }, {
          x: 0,
          y: 10
        }, {
          x: 10,
          y: 5
        }, {
          x: 0.5,
          y: 5.5
        }],
      backgroundColor: colorSecondary
    }]
  };

  const config__scatterGenre = {
    type: 'bubble',
    data: data__scatterGenre,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'No. of Reserved Books by Genre in 2023 (Fantasy)'
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        }
      }
    }
  };

  new Chart(document.getElementById('Genre-Scatter'), config__scatterGenre);

  /* TREEMAP
  ------------------------------------------------------------------------------------------------------ */

  // const table = document.getElementById('Inventory-DataTable');


  /* ******************************************************************************************************************* */
  /******************************************************* FIREBASE *******************************************************/
  /* ******************************************************************************************************************* */

  /* FIREBASE CONFIG ✅
  ------------------------------------------------------------------------------------------------------ */
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

  /* FIREBASE GET BOOK(S) ✅
  ------------------------------------------------------------------------------------------------------ */
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
      var desc = doc.data().description.toString().replace(/"/g, '');
      // var bookmarked = doc.data().bookmark;
      var imageURL = doc.data().image_URL;
      var imageGroup = doc.data().group.toString().replaceAll(' ', '').toLowerCase();

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

      // Push data into data array.
      arrayData.push(imageURL, title, author, genre, language, numOfPages, coverType, formatPubDate, ratings, numOfReviews, rentStatus, formatRentDate);
      arrayDataSet.push(arrayData);

      const tabContentItem = ` 
        <div class="tab-content__item" data-template="BookItem-Tooltip"
        data-title="`+ title + `"
        data-genre="`+ genre + `"
        data-author="`+ author + `"
        data-language="`+ language + `"
        data-desc="`+ desc + `"
        data-ratings="`+ ratings + `"
        data-reviews="`+ numOfReviews + `"
        data-pages="`+ numOfPages + `"
        data-cover-type="`+ coverType + `"
        data-publication-date-format="`+ formatPubDate + `"
        data-publication-date="`+ publicationDate + `"
        data-rental-status="`+ rentStatus + `"
        data-image-group="`+ imageGroup + `"
        data-image-url="`+ imageURL + `"
        data-bookmarked="false"
        >
          <div class="tab-content__item-book">

            <!-- reservation status -->
            <div class="tab-content__item-book-reservation `+ rentStatus + `">
              <span class="background flex-center-all"><h5>Reserved</h5></span>
              <span class="wrap"></span>
            </div>

            <!-- engagements -->
            <div class="tab-content__item-book-engagements flex flex-column">
              <div class="`+ rentStatus + `"><span id="Engagement-Unreserve" class="tab-content__item-unreserve"><i class="fa-solid fa-xmark"></i></span></div>
              <div class=""><span id="Engagement-Bookmark" class="false tab-content__item-bookmark"><i class="fa-solid fa-bookmark "></i></span></div>
              <div>
              <span 
              id="Engagement-Share"><i class="fa-solid fa-share"></i>
              </span>
              </div>
            </div>
            
            <a class="tab-content__tippy-hover tab-content__modal-open" href="#BookItem-Modal" rel="modal:open"></a>

            <!-- book -->
            <div class="book">
            <div class="book-before"></div>
              <div class="image-wrapper">
                  <img loading="lazy" src="./images/covers-front/`+ imageURL + `.webp" alt="Book Image">
              </div>
            </div>
          </div>

          <div class="tab-content__item-content">
            <p class="p-subtitle">`+ genre + `</p>
            <p class="p-title">`+ title + `</p>
            <h6>By <span>`+ author + `</span></h6>
            <button class="flex-column tab-content__item-reserve `+ rentStatus + `">Reserve</button>
          </div>
        </div>
      `;

      // append create elements to tab-content__item div.
      tabContent.append(tabContentItem);
    });

    // Set up paginations and listeners. //
    // divs are created dynamically so need assign listeners within the initialisation function.
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

    // Set reservation button listeners: because elements are created dynamically. //
    listenerBookItemButtons();
    listenerTippyEngagements();

    setUpPagination();

    handleGoToPage();
    handleGoToPageText(totalPages);
    handlePaginationTextForTotalItems();

    // Get and assign book 'bone image'. //
    // Change 'reserve' button text. //
    $('.tab-content__item').each(function () {
      var imageGroup = $(this).data("image-group");
      $(this).find('.book-before').css('background', 'url("/images/covers-bone/' + imageGroup + '.webp")');

      if ($(this).find('button').hasClass('true')) {
        $(this).find('button').text('Reserved');
      }
    });

    // Initialise DataTable. //
    const table = new DataTable('#Inventory-DataTable', {
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
      lengthMenu: [5, 10, 15, 20, 25, 30],
      pageLength: 5,
      fixedColumns: {
        left: 1,
        right: 1
      },
      scrollX: true,
      scrollCollapse: true,
      paging: true,
      responsive: true,
      autoWidth: false,
    });

    // hover callbacks.
    table.on('mouseenter', 'td', function () {
      let colIdx = table.cell(this).index().column;

      table
        .cells()
        .nodes()
        .each((el) => el.classList.remove('highlight'));

      table
        .column(colIdx)
        .nodes()
        .each((el) => el.classList.add('highlight'));
    });

    table.on('mouseleave', 'td', function () {
      let colIdx = table.cell(this).index().column;

      table
        .cells()
        .nodes()
        .each((el) => el.classList.remove('highlight'));
    });

    // click callback.
    table.on('click', 'tbody tr', function (e) {
      e.currentTarget.classList.toggle('selected');
    });

    document.querySelector('#DataTable-Delete-Button').addEventListener('click', function () {
      const numOfRows = table.rows('.selected').data().length
      table.rows('.selected').remove().draw();
      showSnackBar(numOfRows + " row(s) has been successfully removed.")
    });

    // Modal Listener. //
    $('.tab-content__item .tab-content__modal-open').click(function () {
      // cover image
      var imageURL = $(this).closest('.tab-content__item').data('image-url');
      $('.book-cover').css('background', 'url(/images/covers-front/' + imageURL + '.webp)')
      // back image, bone image
      var imageGroup = $(this).closest('.tab-content__item').data('image-group');
      $('.book-back').css('background', 'url(/images/covers-back/' + imageGroup + '.webp)')
      $('.book-bone').css('background', 'url(/images/covers-bone/' + imageGroup + '.webp)')

      // text
      var title = $(this).closest('.tab-content__item').data('title');
      var author = $(this).closest('.tab-content__item').data('author');
      var genre = $(this).closest('.tab-content__item').data('genre');
      var desc = $(this).closest('.tab-content__item').data('desc');
      var rating = $(this).closest('.tab-content__item').data('ratings');
      var reviews = $(this).closest('.tab-content__item').data('reviews');

      var pages = $(this).closest('.tab-content__item').data('pages');
      var publishDate = $(this).closest('.tab-content__item').data('publication-date-format');
      var language = $(this).closest('.tab-content__item').data('language');
      var coverType = $(this).closest('.tab-content__item').data('cover-type');

      $('.modal-title').text(title);
      $('.modal-author').text(author);
      $('.modal-genre').text(genre);
      $('.modal-rating').text(rating);
      $('.modal-reviews').text(reviews);
      $('.modal-desc').text(desc);
      $('.modal-pages').text(pages + " pages");
      $('.modal-publish-date').text(publishDate);
      $('.modal-language').text(language);
      $('.modal-cover-type').text(coverType);

      // rating
      const tempArrRatings = new Array(Math.floor(rating));
      $.each(tempArrRatings, function (index) {
        index++;
        $('.model-content__ratings .rating-star:nth-child(' + index + ')').removeClass('inactive');
      });
    });

    // Tippy listener. //
    tippy('.tab-content__item .tab-content__tippy-hover', {
      content(reference) {
        reference = reference.closest('.tab-content__item');
        const title = reference.getAttribute('data-title');
        const genre = reference.getAttribute('data-genre');
        const author = reference.getAttribute('data-author');
        const desc = reference.getAttribute('data-desc');

        const id = reference.getAttribute('data-template');
        const template = document.getElementById(id);

        template.querySelector('.tooltip__title').innerHTML = title;
        template.querySelector('.tooltip__genre').innerHTML = genre;
        template.querySelector('.tooltip__author').innerHTML = author;
        template.querySelector('.tooltip__desc').innerHTML = desc;

        return template.innerHTML;
      },
      // content: template.innerHTML,
      allowHTML: true,
      placement: 'right-start',
      arrow: true,
      animation: 'scale-extreme',
      // followCursor: false,
      // interactive: true,
      // trigger: "manual",
      // showOnCreate: true,
      // hideOnClick: false
    });

    // Assign default array (for sorting). //
    domBookItems = document.querySelectorAll('.tab-content__item');
    arrayDefaultSortedBookItems = Array.from(domBookItems);
  }

  /* FIREBASE ADD BOOK(S) ✅
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

  // getBooksAndPopulate();

  /* ******************************************************************************************************************* */
  /******************************************************** NAVBAR ********************************************************/
  /* ******************************************************************************************************************* */

  /* = TOP NAV ✅
  ------------------------------------------------------------------------------------------------------ */
  if (viewportWidth < 750) {
    setNavActiveForMobile();
  }

  $(".nav__link").click(function () {
    var sectionToScroll = "#section__"
    var clickedNav = $(this).data('nav'); // get the clicked nav item

    sectionToScroll += clickedNav;
    scrollToSection(sectionToScroll);
  });

  function scrollToSection(sectionToScroll) {
    $('html, body').animate({
      scrollTop: $(sectionToScroll).offset().top
    }, 700);
  }

  $("#Nav-Add-Book").click(function () {

    var tabContentItem = ` 
        <div class="tab-content__item" data-template="BookItem-Tooltip"
        data-title="`+ title + `"
        data-genre="`+ genre + `"
        data-author="`+ author + `"
        data-language="`+ language + `"
        data-desc="`+ desc + `"
        data-ratings="`+ ratings + `"
        data-reviews="`+ numOfReviews + `"
        data-pages="`+ numOfPages + `"
        data-cover-type="`+ coverType + `"
        data-publication-date-format="`+ formatPubDate + `"
        data-publication-date="`+ publicationDate + `"
        data-rental-status="`+ rentStatus + `"
        data-image-group="`+ imageGroup + `"
        data-image-url="`+ imageURL + `"
        >
          <div class="tab-content__item-book">

            <!-- reservation status -->
            <div class="tab-content__item-book-reservation `+ rentStatus + `">
              <span class="background flex-center-all"><h5>Reserved</h5></span>
              <span class="wrap"></span>
            </div>

            <!-- engagements -->
            <div class="tab-content__item-book-engagements flex flex-column">
              <div class="`+ rentStatus + `"><span id="Engagement-Unreserve" class="tab-content__item-unreserve"><i class="fa-solid fa-xmark"></i></span></div>
              <div><span id="Engagement-Bookmark"><i class="fa-solid fa-bookmark"></i></span></div>
              <div>
              <span 
              id="Engagement-Share"><i class="fa-solid fa-share"></i>
              </span>
              </div>
            </div>
            
            <a class="tab-content__tippy-hover tab-content__modal-open" href="#BookItem-Modal" rel="modal:open"></a>

            <!-- book -->
            <div class="book">
            <div class="book-before"></div>
              <div class="image-wrapper">
                  <img loading="lazy" src="./images/covers-front/`+ imageURL + `.webp" alt="Book Image">
              </div>
            </div>
          </div>

          <div class="tab-content__item-content">
            <p class="p-subtitle">`+ genre + `</p>
            <p class="p-title">`+ title + `</p>
            <h6>By <span>`+ author + `</span></h6>
            <button class="flex-column tab-content__item-reserve `+ rentStatus + `">Reserve</button>
          </div>
        </div>
      `;

    // append create elements to tab-content__item div.
    tabContent.append(tabContentItem);
  });

  // Mobile Resize
  $(window).on("resize", function () {
    viewportWidth = $(window).width();
    if (viewportWidth < 750) {
      setNavActiveForMobile();
    }
  });

  function setNavActiveForMobile() {
    $('.menu-item').removeClass('active');

    if (elementInView(sectionHome)) {
      $('.menu-item:nth-child(1)').addClass('active');
    }
    else if (elementInView(sectionStatistics)) {
      $('.menu-item:nth-child(2)').addClass('active');
    }
    else if (elementInView(sectionInventory)) {
      $('.menu-item:nth-child(3)').addClass('active');
    }
    else if (elementInView(sectionContact)) {
      $('.menu-item:nth-child(4)').addClass('active');
    }
  }

  /* = DOT NAV ✅
  ------------------------------------------------------------------------------------------------------ */
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

  function elementCenterInView(element) {
    var windowCenter = $(window).scrollTop() + $(window).height() / 2;
    var elementCenter = $(element).offset().top + $(element).height() / 2;

    // Check if the window's center is within the vertical range of the element
    return (Math.abs(windowCenter - elementCenter) < $(element).height() / 2);
  }

  // Set dot nav UI.
  function setDotNav(dot) {
    $(".dot-wrapper.active").removeClass("active")
    $(dot).addClass("active")
  }

  // Set dot nav on load or refresh.
  if (elementInView(sectionHome)) {
    setDotNav(dot1);
  }
  else if (elementInView(sectionStatistics)) {
    setDotNav(dot2);
  }
  else if (elementInView(sectionInventory)) {
    setDotNav(dot3);
  }
  else if (elementInView(sectionContact)) {
    setDotNav(dot4);
  }

  // Set dot nav UI when scorlling.
  $(window).scroll(function () {

    if (viewportWidth < 750) {
      setNavActiveForMobile();
    }
    else {
      if (elementInView(sectionHome)) {
        setDotNav(dot1);
      }
      else if (elementInView(sectionStatistics)) {
        setDotNav(dot2);
      }
      else if (elementInView(sectionInventory)) {
        setDotNav(dot3);
      }
      else if (elementInView(sectionContact)) {
        setDotNav(dot4);
      }
    }
  });

  $(".dot-wrapper").click(function () {
    var sectionToScroll = "#section__"
    var section = $(this).data('nav');
    sectionToScroll += section;
    scrollToSection(sectionToScroll);
  });

  function showSnackBar(text) {
    $('.snackbar').find('p').text(text);
    $('.snackbar').addClass('show');

    setTimeout(function () {
      $('.snackbar').removeClass('show');
    }, 1300);
  }

  /* ******************************************************************************************************************* */
  /****************************************************** SECTION 1 ******************************************************/
  /* ******************************************************************************************************************* */

  /* = SERACH BAR ✅
  ------------------------------------------------------------------------------------------------------ */
  // $(".search-bar__container").click(function () {
  //   $(this).focus();
  // });

  /* = RESERVATION BUTTON ✅
  ------------------------------------------------------------------------------------------------------ */
  function listenerBookItemButtons() {
    // Reserve Button.
    $(".tab-content__item-reserve").click(function () {
      // disable reserve button.
      $(this).text('Reserved').prop('disabled', true).addClass('true');
      // add unreserve button.
      $(this).parents(".tab-content__item").find('.tab-content__item-unreserve').parent().removeClass('false');
      // add banner.
      $(this).parents(".tab-content__item").find('.tab-content__item-book-reservation').removeClass('false').addClass('true');
      // get title.
      var title = $(this).parents().closest('.tab-content__item').attr('data-title');
      showSnackBar(title + " has been successfully reserved.")
    });

    // Unreserve Button.
    $(".tab-content__item-unreserve").click(function () {
      // enable reserve button.
      $(this).parents('.tab-content__item').find('.tab-content__item-reserve').text("Reserve").prop('disabled', false).removeClass('true');
      // remove unreserve button.
      $(this).parent().addClass('false');
      // remove banner.
      $(this).parents(".tab-content__item").find('.tab-content__item-book-reservation').removeClass('true').addClass('false');
      // get title.
      var title = $(this).parents().closest('.tab-content__item').attr('data-title');
      showSnackBar(title + " has been successfully unreserved.")
    });

    // Bookmark Button.
    $(".tab-content__item-bookmark").click(function () {

      var item = $(this).closest('.tab-content__item');
      var title = item.data('title');

      if (item.data('bookmarked') == false) {
        var book = $(this).closest('.tab-content__item');
        var title = book.data('title');
        var author = book.data('author');
        var genre = book.data('genre');
        var imageURL = book.data('image-url');
        var rentStatus = book.data('rental-status');

        var bookmarkItem =
          ` 
      <div class="bookmark-item" data-title="`+ title + `">
        <div class="book-item bookmark">
            <div class="book">
                <div class="book-before"></div>
                <div class="image-wrapper">
                  <img loading="lazy" src="./images/covers-front/`+ imageURL + `.webp" alt="Book Image">
                </div>
            </div>

            <div class="text">
              <p class="p-subtitle">`+ genre + `</p>
              <p class="p-title">`+ title + `</p>
              <h6>By <span>`+ author + `</span></h6>
              <button class="flex-column tab-content__item-reserve `+ rentStatus + `">Reserve</button>
            </div>
        </div>

        <div>
            <i class="fa-solid fa-xmark bookmark-cancel"></i>
        </div>
      </div>
        `;

        // append create elements to tab-content__item div.
        bookmarkContainer.append(bookmarkItem);

        showSnackBar(title + " has been added to bookmarks.")

        $(this).removeClass('false')
        $(this).addClass('true');
        item.data('bookmarked', true);
      }
      else {
        // remove
        $('.bookmark-item[data-title="' + title + '"]').remove()

        showSnackBar(title + " has been removed from bookmarks.")

        $(this).removeClass('true')
        $(this).addClass('false');
        item.data('bookmarked', false);
      }

    });
  }
  /* = DISPLAY STYLE ✅
  ------------------------------------------------------------------------------------------------------ */
  $('#Book-Display__List-View').click(function () {
    $('.tab-content').addClass('list');
    $('.tab-content').find('*').addClass('list');
    $('.tab-options__select-hide').css("display", "flex");

    $('.tab-options__view-icon').removeClass('active');
    $(this).addClass('active');

    const arrayNewNumbers = [12, 15, 18, 21, 24, 27];

    $('#pagination__options').find('option').each(function (index) {
      $(this).text(arrayNewNumbers[index]);
      $(this).val(arrayNewNumbers[index]);
    });

    $('#pagination__options').val('12').change();
    paginationLimit = 12;
    totalPages = Math.ceil(numberOfItems / paginationLimit);


    setUpPagination();

    if (currentPage + 1 > totalPages) {
      setPaginationPage(0);
    }
    else {
      setPaginationPage(currentPage);
    }

    handleGoToPage();
    handleGoToPageText(totalPages);
    handlePaginationTextForTotalItems();
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

    $('#pagination__options').val('8').change();
    paginationLimit = 8;
    totalPages = Math.ceil(numberOfItems / paginationLimit);

    setUpPagination();

    if (currentPage + 1 > totalPages) {
      setPaginationPage(0);
    }
    else {
      setPaginationPage(currentPage);
    }

    handleGoToPage();
    handleGoToPageText(totalPages);
    handlePaginationTextForTotalItems();
  });

  /* = PAGINATION ✅
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

    // set page.
    if (currentPage + 1 > totalPages) {
      setPaginationPage(0);
    }
    else {
      setPaginationPage(currentPage);
    }
    // set button.
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

  // No Book Items.
  function setNoBookItem() {
    if (numberOfItems == 0) {
      $('.tab-content').addClass('no-item');
      $('.tab-content__no-item').show();
    }
    else {
      $('.tab-content').removeClass('no-item');
      $('.tab-content__no-item').hide();
    }
  }

  /* = PAGINATION SELECT ✅
  ------------------------------------------------------------------------------------------------------ */
  // Handle option select for display number of items/
  function listenerSelectPaginationOption() {
    $("#pagination__options").on("change", function () {
      // get limit from option selected.
      paginationLimit = $("#pagination__options option:selected").val();
      // change global variable.
      totalPages = Math.ceil(numberOfItems / paginationLimit);

      // set the pagination.
      setUpPagination();

      handleGoToPage();
      handleGoToPageText(totalPages);
      handlePaginationTextForTotalItems();
    })
  }

  // Disable select option if no. of items is less than option.
  function setPaginationSelect() {

    var selectOptions = $(".tab-options__pagination-options").find("option");
    var selectedOption = $(".tab-options__pagination-options").find("option:selected");
    // disable all options
    selectOptions.attr("disabled", true);
    // change value to selected value
    selectedOption.text(selectedOption.val());

    if ($('.tab-content__item:visible').length != 0) {
      selectOptions.each(function () {
        // enable option per loop
        $(this).attr("disabled", false);
        // if option exceed number of current items, break loop
        if (numberOfItems < $(this).val()) {
          $(this).attr("disabled", true);
          return false;
        }
      });
    }
    else {
      $(".tab-options__pagination-options").find("option:selected").text('0');
    }
  }

  /* = PAGINATION TEXT ✅
  ------------------------------------------------------------------------------------------------------ */
  // Handle number range for items showing text.
  function handlePaginationTextForShowRange() {
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
    // last page.
    if (currentPage + 1 === totalPages) {
      end = numberOfItems;
    }
    // no items.
    if (numberOfItems == 0) {
      start = 0;
    }
    // change text.
    $('.pagination__number-of-items-text span:nth-child(1)').text(start + " - " + end);
  }

  // Handle 'total number of items' text.
  function handlePaginationTextForTotalItems() {
    $('.pagination__number-of-items-text span:nth-child(2)').text(numberOfItems);
  }

  /* = PAGINATION GO TO PAGE ✅
  ------------------------------------------------------------------------------------------------------ */
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
    if (totalPages == 0) {
      totalPages = 1;
    }
    $('.tab-options__page-input p span').text(totalPages);
  }

  /* = PAGINATION SET UP & LISTENERS ✅
  ------------------------------------------------------------------------------------------------------ */
  // Pagination set up.
  function setUpPagination() {
    setPagination();
    setPaginationButtons();
    setActivePaginationButton(currentPage);
    listenerPaginationButton();
    listenerSelectPaginationOption();
    setPaginationSelect();
    setNoBookItem();
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

  /* = SEARCH FUNCTION ✅
  ------------------------------------------------------------------------------------------------------ */
  let filtered = false;

  // Search
  $(".search-bar__button").on("click", function () {

    var input = $(".search-bar__input").val().trim().toLowerCase();
    $(".tab-content__item").hide().removeClass('animate');

    // no input
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
    var booksToLoop;

    if (!filtered) {
      booksToLoop = $(".tab-content__item")
    }
    else {
      booksToLoop = $(".tab-content__item.filtered")
    }

    var searchOption = $('#BookDisplay__search-bar__option').find('option:selected').val();

    booksToLoop.each(function (index) {
      if (($(this).data(searchOption).toLowerCase().includes(input))) {
        $(this).show();
        arrayTemp.push(index);
        // arrayTemp.push($(this).index());

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
    setActivePaginationButton(currentPage);
    listenerPaginationButton();
    listenerSelectPaginationOption();
    setPaginationSelect();

    handleGoToPage();
    handleGoToPageText(totalPages);
    handlePaginationTextForTotalItems();

    setNoBookItem();
  });

  /* = SORT FUNCTION ✅
  ------------------------------------------------------------------------------------------------------ */
  let sortedItems = [];
  let sortDirection = true; // asecending: true, descending: false

  $("#Sort-Options").on("change", function () {
    var sort = $("#Sort-Options option:selected").val();
    var thisTabContentItems = document.querySelectorAll('.tab-content__item');
    var arrayTabContentItems = Array.from(thisTabContentItems);
    sortedItems = arrayDefaultSortedBookItems;

    // default pattern.
    if (sort === 'relevance') {
      // false: descending.
      if (!sortedItems) {
        arrayDefaultSortedBookItems.reverse();
      }
      $('.tab-content').append(sortedItems);
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

      // false: descending.
      if (!sortDirection) {
        sortedItems.reverse();
      }
      $('.tab-content').append(sortedItems);
    }
    // by others.
    else {
      sortedItems = arrayTabContentItems.sort(
        (a, b) => {
          return (
            $(a).attr('data-' + sort)
              <
              $(b).attr('data-' + sort) ? -1 : 1 // ascending
          )
        }
      )
      // false: descending.
      if (!sortDirection) {
        sortedItems.reverse();
      }
      $('.tab-content').append(sortedItems);
    }

    setPaginationPage(currentPage);
  })

  $(".tab-options__sort-order:not(:has(.active))").on("click", function () {

    if (sortedItems.length == 0) {
      sortedItems = arrayDefaultSortedBookItems;
    }

    // ascending.
    if (!sortDirection) {
      $(this).parent().find('.tab-options__sort-order.down').removeClass('active')
      $(this).addClass('active');

      sortedItems = sortedItems.sort().reverse();
      $('.tab-content').append(sortedItems);
      sortDirection = true;
    }
    // descending.
    else {
      $(this).parent().find('.tab-options__sort-order.up').removeClass('active')
      $(this).addClass('active');

      sortedItems = sortedItems.sort().reverse();
      $('.tab-content').append(sortedItems);
      sortDirection = false;
    }
    setPaginationPage(currentPage);
  });

  /* = FILTER FUNCTION ✅
  ------------------------------------------------------------------------------------------------------ */
  let arrayFilters = [];

  $(".tab-options__filter-container button").on("click", function () {
    // filter.
    $(this).toggleClass('active');
    $(this).parents().closest('div').find('.filter-menu').toggleClass('active');
  });

  $(".filter__select-button").on("click", function () {
    // filter.
    var filter = $(this).parent().find('select option:selected').val();
    var filterType = $(this).parents('.select-container').data('filter-type');
    var tempDict = { [filterType]: filter };

    if (!arrayFilters.some(e => e[filterType] == filter)) {
      // filter item container.
      var filterContainer = $(this).closest('.select-container').find('.filter__select-chosen-container');
      // create filter item element.
      var filterItem = `<div data-filter="` + filter + `" data-filter-type="` + filterType + `">` + filter + `<i class="fa-solid fa-xmark"></i></div>`;
      // append to container.
      filterContainer.append(filterItem);
      arrayFilters.push(tempDict)
    }
    else {
      alert(filter + " already added.");
    }

    listenerCancelFilterItem();
  });

  function listenerCancelFilterItem() {
    $(".filter__select-chosen-container > div").on("click", function () {
      var filter = $(this).data('filter');
      var filterType = $(this).data('filter-type');

      arrayFilters = arrayFilters.filter(function (e) { return e[filterType] !== filter })
      $(this).remove();

      if (arrayFilters.length == 0) {
        filtered = false;
      }
    });
  }

  $("#Filter__Button").on("click", function () {

    arrayIndexesPerPage = [];
    var arrayTemp = [];
    const allKeys = arrayFilters.flatMap(obj => Object.keys(obj));
    var bookItemsToLoop = $('.tab-content__item');

    // if array filters not empty
    if (!arrayFilters.length == 0) {

      $.each(arrayFilters, function (index) {
        if (filtered == true) {
          bookItemsToLoop = $('.tab-content__item.filtered');
        }

        var filterType = allKeys[index];
        var filter = arrayFilters[index][filterType];

        bookItemsToLoop.each(function (index) {
          if ($(this).data(filterType).toString() === filter.toString()) {

            // alert(index)
            // alert($(this).data(filterType).toString() === filter.toString());

            $(this).show().addClass('animate filtered');

            arrayTemp.push(index);

            if (arrayTemp.length >= paginationLimit) {
              arrayIndexesPerPage.push(arrayTemp);
              arrayTemp = [];
            }
          }
          else {
            $(this).hide().removeClass('animate filtered');
          }
          // when reach last item, add array to parent to array.
          if (index >= $(".tab-content__item").length - 1) {
            arrayIndexesPerPage.push(arrayTemp);
          }
        });
        filtered = true;
      });

      if ($(".tab-content__item.filtered").length == 0) {
        bookItems = $(".tab-content__item");
      }
      else {
        bookItems = $(".tab-content__item.filtered");
      }

      numberOfItems = bookItems.length;
      totalPages = Math.ceil(numberOfItems / paginationLimit);

      // alert(numberOfItems);

      if (currentPage + 1 > totalPages) {
        setPaginationPage(0);
      }
      else {
        setPaginationPage(currentPage);
      }
      setPaginationButtons();

      setPaginationButtons();
      setActivePaginationButton(currentPage);
      listenerPaginationButton();
      listenerSelectPaginationOption();
      setPaginationSelect();

      handleGoToPage();
      handleGoToPageText(totalPages);
      handlePaginationTextForTotalItems();
    }
    else {
      alert('Please add filter conditions.');
      resetFilter();
    }
  });

  function resetFilter() {
    $(".tab-content__item").show().addClass('animate');

    bookItems = $(".tab-content__item");
    numberOfItems = bookItems.length;
    totalPages = Math.ceil(numberOfItems / paginationLimit);

    setUpPagination();
    filtered = false;
  }




  // DASHBOARD
  $(function () {
    $(".chart-tabs").tabs();
  });

  $('#Select-Statistics').on("change", function () {
    var selected = $(this).find(':selected').val();
    $('.statistics__option-container').hide().removeClass('animate');
    $('#Tab-' + selected).show().addClass('animate');
  });

  let dashboardExpanded = false;
  $(".dashboard_board:not(:nth-child(1))").click(function () {

    var webSize = true;

    if ($(window).width() < 1024) {
      webSize = false
    }

    if (!dashboardExpanded) {
      $(".dashboard_board").hide();
      $(this).show();
      $(this).parent().css('height', 'fit-content');
      dashboardExpanded = true;
    }
    else {
      $(".dashboard_board").show();
      if (webSize) {
        $(this).parent().css('height', '120vh');
      }
      else {
        $(this).parent().css('height', '1700px');
      }
      dashboardExpanded = false;
    }
  });

  $(window).on("resize", function () {
    var viewportWidth = $(window).width();
    // var viewportHeight = $(window).height();

    // if dashboard not expand then adjust size.
    if (!dashboardExpanded) {
      if (viewportWidth < 1024) {
        $('.dashboard_board').parent().css('height', '1700px');
      }
      else {
        $('.dashboard_board').parent().css('height', '120vh');
      }
    }
  });

  tippy('.dashboard_board:not(:nth-child(1))', {
    content: "Click to expand chart.",
  });

  $('.footer .row a').click(function () {
    var sectionToScroll = "#section__"
    const section = $(this).data('section');
    sectionToScroll += section;
    scrollToSection(sectionToScroll);
  });

  /* **************************************************************************************************************** */
  /****************************************************** MODAL ******************************************************/
  /* ************************************************************************************************************** */

  /* = MODAL ✅
  ------------------------------------------------------------------------------------------------------ */
  var modalBook = $('#BookItem-Modal #book');
  let modalBookClickCounter = 0;
  modalBook.removeClass().addClass('view-rotate');

  $(modalBook).click(function () {
    switch (modalBookClickCounter) {
      case 0:
        modalBookClickCounter++;
        modalBook.removeClass('view-rotate').addClass('view-cover');
        break;
      case 1:
        modalBookClickCounter++;
        modalBook.removeClass('view-cover').addClass('view-back');
        break;
      case 2:
        modalBookClickCounter++;
        modalBook.removeClass('view-back').addClass('view-cover');
        setTimeout(function () {
          modalBook.removeClass('view-cover').addClass('open-book');
        }, 1000);
        break;
      case 3:
        modalBookClickCounter = 0;
        modalBook.removeClass('open-book')
        setTimeout(function () {
          modalBook.addClass('view-rotate');
        }, 1000);
        break;
      default:
    }
  });

  /* *****************************************************************&************************************************ */
  /****************************************************** TOOLTIP ******************************************************/
  /* **************************************************************************************************************** */

  /* = TOOLTIP ✅
  ------------------------------------------------------------------------------------------------------ */
  function listenerTippyEngagements() {
    tippy('#Engagement-Unreserve', {
      content: "Unreserve the book.",
    });

    tippy('#Engagement-Bookmark', {
      content: "Save a book that caught your eye.",
    });

    tippy('#Engagement-Share', {
      content: "Share a book that you really like.",
    });
  }
});