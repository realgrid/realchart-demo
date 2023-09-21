console.log(window.location.search);
if (window.location.search.indexOf('debug') >= 0) {
    RealChart.setAnimatable(false);
}