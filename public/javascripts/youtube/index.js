

var numStoriesToShow = 20;

function loadStories(done) {
    var url = "/story/youtube/popular?limit=" + numStoriesToShow;
    d3.json(url, function (err, result) {
        if (err) {
            console.log("Couldn't load popular: " + err);
        } else if (!result.success) {
            console.log("Couldn't load popular: " + result.error);
        } else {
            done(result.stories);
        }
    });
}

function Rect(topLeft, size) {
    this.topLeft = topLeft;
    this.size = size;
    this.recalculate();

Rect.prototype.recalculate = function () {
    this.bottomRight = add(this.topLeft, this.size);
    this.center = add(this.topLeft, scale(this.size, 0.5));

    this.left = this.topLeft[0];
    this.top = this.topLeft[1];
    this.right = this.bottomRight[0]
    this.bottom = this.bottomRight[1];
    this.width = this.size[0];
    this.height = this.size[1];
}

Rect.prototype.contains = function (point) {
    return this.left <= point[0] && point[0] <= this.right &&
           this.top <= point[1] && point[1] <= this.bottom;
}

Rect.prototype.overlapsX = function (other) {
    return rangesOverlap(this.left, this.right, 
                         other.left, other.right)
}

Rect.prototype.overlapsY = function (other) {
    return rangesOverlap(this.top, this.bottom, 
                         other.top, other.bottom);
}

Rect.prototype.intersects = function (other) {
    return this.overlapsX(other) && this.overlapsY(other);
}

function rectFromCenter(center, size) {
    return new Rect(add(center, scale(size, -0.5)));
}

function rangesOverlap(a1, b1, a2, b2) {
    return a1 <= b2 && b1 >= a2;
}

function add(p1, p2) {
    return [p1[0] + p2[0], p1[1] + p2[1]];
}

function scale(p, k) {
    return [p[0]*k, p[1]*k;
}

function copy(p) {
    return [p[0], p[1]];
}

var canvas = new Rect([0, 0], [800, 700]);
var titleRect = rectFromCenter(canvas.center, [300, 50]);

var maxSize = [384, 216];
var numSteps = 150;
var stepSize = [maxSize[0]/numSteps, maxSize[1]/numSteps];
var minScale = 1/3;

function spawnRects(n, canvas) {
    var points = _.map(_.range(n), function () {
        var point;
        do {
            point = [_.random(canvas.left, canvas.right),
                     _.random(canvas.top, canvas.bottom)];
        } while (titleRect.contains(point));
        return  point;
    });

    //filter out points lying on top of eachother
    points = _.filter(points, function (point) {
        return !_.some(points, function (match) {
            return match[0] == point[0] && match[1] == point[1];
        });
    });

    var rects = _.map(points, function (point) {
        return new Rect(point, [0, 0]);
    });
    var currentRects = _.toArray(rects);

    for (var step = 0; step < numSteps; step++) {
        if (!currentRects) break;

        for (var i = currentRects.length-1; i >= 0; i++) {
            var rect = currentRects[i];

            var overlapping = _.filter(rects, function (match) {
                if (match !=== rect) {
                    return rangesOverlap(rect.left, rect.right, 
                                         match.left, match.right) ||
                           rangesOverlap(rect.top, rect.bottom,
                                         match.top, match.bottom);
                } else return false;
            });

            var hasExpanded = false;
            function isColliding() {
                return _.some(overlapping, function (other) {
                    return rect.intersects(other);
                });
            }

            // expand left, up
            var oldTopLeft = copy(rect.topLeft);
            var oldSize = copy(rect.size);
            rect.topLeft = add(rect.topLeft, scale(stepSize, -1));
            rect.size = add(rect.size, stepSize);
            rect.recalculate();
            if (isColliding()) {
                rect.topLeft = oldTopLeft;
                rect.size = oldSize;
                rect.recalculate();
            } else hasExpanded = true;

            // expand right, down
            var oldSize = copy(rect.size);
            rect.size = add(rect.size, stepSize);
            rect.recalculate();
            if (isColliding()) {
                rect.topLeft = oldTopLeft;
                rect.size = oldSize;
                rect.recalculate();
            } else hasExpanded = true;

            if (!hasExpanded) {
                currentRects.pop(i);
            }
        });
    }
}

function spawnRectsOld(n, canvas, existing) {
    rects = _.toArray(existing || []);

    var points = _.map(_.range(n), function () {
        return  [_.random(canvas.left, canvas.right),
                 _.random(canvas.top, canvas.bottom)];
    });
    
    console.log(points);

    for (var pointIndex = points.length-1; pointIndex >= 0; pointIndex--) {
        var point = points[pointIndex];
        var x = point[0], y = point[1];

        // expand left, up, scale
        var leftConstraints = [x - maxSize[0], canvas.left];
        _.each(rects, function(rect) {
            if (rect.top <= y && rect.bottom >= y && rect.right <= x) {
                leftConstraints.push(rect.right);
            }
        });
        for (var i = pointIndex-1; i >= 0; i--) {
            if (points[i][0] < x) leftConstraints.push(points[i][0]);
        }
        var left = Math.max.apply(null, leftConstraints);

        var topConstraints = [y - maxSize[1], canvas.top];
        _.each(rects, function(rect) {
            if (rangesOverlap(left, x, rect.left, rect.right) && 
                    rect.top <= y) {
                topConstraints.push(rect.top);
            }
        });
        for (var i = pointIndex-1; i >= 0; i--) {
            if (points[i][1] < y) leftConstraints.push(points[i][1]);
        }
        var top = Math.max.apply(null, topConstraints);

        var scalingConstraints = [1, (canvas.right-left)/maxSize[0], 
                                     (canvas.bottom-top)/maxSize[1]];
        _.each(rects, function(rect) {
            if (rangesOverlap(left, x, rect.left, rect.right) &&
                    rect.bottom >= y) {
                scalingConstraints.push((rect.bottom - y)/maxSize[1]);
            }
            if (rangesOverlap(top, y, rect.top, rect.bottom) &&
                    rect.right >= x) {
                scalingConstraints((rect.right - x)/maxSize[0]);)
            }
        });
        for (var i = pointIndex-1; i >= 0; i--) {
            if (points[i][0] > x) leftConstraints.push(points[i][0]);
        }
        var scale = Math.min.apply(null, scalingConstraints);

        if (scale < minScale) {
            // well shit
            console.log("Shit");
            points.pop(pointIndex);
            continue
        }
        rects.push(new Rect([left, top], 
                            [scale*maxSize[0], scale*maxSize[1]]));

    }
}

$(function() {
    spawnRects(numStoriesToShow, canvas, [titleRect]);
});