var courses = new Vue({
  el: '#courses',
  delimiters: ['${','}'],
  data: {
    courses: [],
    activeCourse: {},
    currentPage: 1,
    perPage: 12,

    filters: {
      keywords: '',

      areas: [],

      cities: []
    },

    query: {
      keywords: '',

      areas: [],

      cities: []
    },

    openFilter: null
  },

  watch: {
    currentPage: function() {
      setTimeout(function() {
        document.getElementById('courses').scrollIntoView({behavior: "smooth"});
      }, 100);
    }
  },

  computed: {
    filteredList: function() {
      if (!this.hasFilters) return this.courses;

      var q = this.query;

      return this.courses.filter(function(course) {
        return ( q.keywords.length === 0 || _.includes(course.course.toLowerCase(), q.keywords.toLowerCase()) )
            && _.includes(q.cities, course.city)
            && _.includes(q.areas, course.area);
      });
    },

    resultsText: function() {
      var coursesCount = this.courses.length;
      var resultsCount = this.filteredList.length;

      if (resultsCount === 0) {
        return 'No encontramos Másters para tu búsqueda';

      } else if (this.hasFilters) {
        var areasText = _.isEqual(this.query.areas, this.filters.areas) ? '' : ' de ' + this.query.areas.join(', ');
        var citiesText = _.isEqual(this.query.cities, this.filters.cities) ? '' : ' en ' + this.query.cities.join(', ');

        return resultsCount + ' Másters Oficiales' + areasText + citiesText;

      } else {
        return coursesCount + ' Másters Oficiales';
      }
    },

    startIndex: function() {
      return (this.currentPage - 1) * this.perPage;
    },

    endIndex: function() {
      var itemsCount = this.filteredList.length;
      var pageLastIndex = this.currentPage * this.perPage;
      return pageLastIndex < itemsCount ? pageLastIndex : itemsCount;
    },

    paginatedList: function() {
      return this.filteredList.slice(this.startIndex, this.endIndex);
    },

    pageCount: function() {
      return Math.ceil(this.filteredList.length / this.perPage);
    },

    hasFilters: function() {
      return !_.isMatch(this.query, this.filters);
    }
  },

  methods: {
    toogleFilter: function(filter) {
      this.openFilter && this.openFilter === filter ? this.closeFilters() : this.showFilter(filter);
    },
    showFilter: function(filter) {
      this.closeFilters();
      this.openFilter = filter;

    },
    closeFilters: function() {
      this.openFilter = null;
    },
    selectAll: function(filter) {
      this.query[filter] = this.filters[filter];
    },
    clearAll: function(filter) {
      if (filter === 'all') {
        this.query['keywords'] = '';
        this.query['areas'] = this.filters['areas'];
        this.query['cities'] = this.filters['cities'];
      } else {
        this.query[filter] = [];
      }
    },
    changePage: function(n) {
      this.currentPage = n;
    },
    toggleModal: function(content) {
      this.activeCourse = content;
    }
  },

  created: function() {

    var self = this;
    var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/16C4SoPyq50yP2rLITPspAlAQLgDYBEK96Lf3Y1mVcQo/edit?usp=sharing';

    Tabletop.init( { key: publicSpreadsheetUrl,
                   callback: showInfo,
                   simpleSheet: true } )

    function showInfo(data, tabletop) {
      self.courses = data;
      var cities = _.uniq(_.map(data, 'city')).sort()
      var areas = _.uniq(_.map(data, 'area')).sort();
      self.filters.cities = cities;
      self.query.cities = cities;
      self.filters.areas = areas;
      self.query.areas = areas;
    }
  }
});
