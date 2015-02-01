(function (H) {
    H.wrap(H.Tooltip.prototype, 'refresh', function (proceed, points) {
        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        // For each point add or update trackball
        H.each(points, function (point) {
            // Function variables
            var size = 5,
                series = point.series,
                chart = series.chart,
                pointX = point.plotX + series.xAxis.pos,
                pointY = H.pick(point.plotClose, point.plotY) + series.yAxis.pos;
            // If trackball functionality does not already exist
            if (!point.series.options.marker) {
                // If trackball is not defined
                if (!series.trackball) {
                    series.trackball = chart.renderer.circle(pointX, pointY, size).attr({
                        //fill: series.color,
	                    fill: '#333',
                        stroke: 'white',
                        'stroke-width': 1,
                        zIndex: 5
                    }).add();
                } else {
                    series.trackball.attr({
                        x: pointX,
                        y: pointY
                    });
                }
            }
        });
    });

    H.wrap(H.Tooltip.prototype, 'hide', function (proceed) {
        var series = this.chart.series;
        // Run original proceed method
        proceed.apply(this);
        // For each series destroy trackball
        H.each(series, function (serie) {
            var trackball = serie.trackball;
            if (trackball) {
                serie.trackball = trackball.destroy();
            }
        });
    });
}(Highcharts));
