function load() {
    const NOTES = [ 'do', 're', 'mi', 'fa', 'sol', 'la', 'si' ];
    const LENGTH_NOTES = ["1", "1/2", "1/4", "1/8", "1/16"];
    const NOTES_IMAGES = ['./images/1.svg','./images/2.svg','./images/4.svg','./images/8.svg','./images/16.svg'];
    const STAFF_PATH = './images/staff.svg';
    const BORDER = 20;
    const STEPY = 6;
    const STEPX = 20;
    const CANVAS_WIDTH = 800;
    const HALF_STEPY = Math.floor(STEPY/2);
    const STAVE_LINES = 5;
    const MAX_NOTES = 10;
    const HEIGHT_STAVE = 80;
    const STAVE_WIDTH = CANVAS_WIDTH-40;

    var sizeFlag = true;
    var start = 0, finish = 0;
    var xStart = BORDER,
        yNotes = BORDER,
        xEnd = CANVAS_WIDTH - BORDER;
    var yStart = yNotes,
        yEnd = yNotes;
    var yStave = BORDER;

    // get JSON
    var jsonData = JSON.parse(data);
    if (jsonData.length > 0) {
        const lenJSON = jsonData.length;

        var canvas=document.getElementById("note-stave");
        if (canvas.getContext){
            var ctx = canvas.getContext('2d');
            ctx.canvas.width  = CANVAS_WIDTH;

            // how much stave notes to do drawing
            var iter = Math.floor(lenJSON/MAX_NOTES);
            if (lenJSON > iter*MAX_NOTES) {
                iter++;
            }

            ctx.canvas.height = iter*(BORDER + HEIGHT_STAVE) + BORDER;

            for (var j = 0; j<iter; j++) {
                if (j !== 0) {
                    yStave += (BORDER + HEIGHT_STAVE);
                }
                yNotes = STEPY*STAVE_LINES + yStave;

                // draw stave notes
                var staffObj = new Image();
                staffObj.src = STAFF_PATH;
                (function(obj, x, y) {
                    obj.onload = function() {
                        ctx.beginPath();
                        ctx.moveTo(xStart,y);
                        ctx.drawImage(staffObj, x, y, STAVE_WIDTH, HEIGHT_STAVE);
                        ctx.stroke();
                    };
                })(staffObj, xStart, yStave);

                // draw notes
                // set start x position for new stave
                var xNotes = xStart + STEPX + 20;
                // set start y position for new stave
                yStart = yNotes + HALF_STEPY;

                finish = (j+1)*MAX_NOTES;
                if (finish > lenJSON) {
                    finish = lenJSON;
                }
                for (var i = start; i < finish; i++) {
                    // find item for notes
                    var item = NOTES.indexOf(jsonData[i].note);
                    if (item >= 0) {
                        // find item for note svg file
                        var len = LENGTH_NOTES.indexOf(jsonData[i].lengths);
                        if (len >= 0) {
                            if (len === 0) {
                                //not resizing note svg file
                                sizeFlag = true;
                            } else {
                                sizeFlag=false;
                            }

                            // next y coordinates for note
                            yNotes = yStart - item * HALF_STEPY;

                            // choose image notes and show it
                            var imgObj = new Image();
                            imgObj.src = NOTES_IMAGES[len];
                            (function(obj, x, y, flag) {
                                obj.onload = function() {
                                    ctx.beginPath();
                                    ctx.moveTo(x,y);
                                    if (flag) {
                                        ctx.drawImage(obj, x, y-6, 8, 8);
                                    } else {
                                        ctx.drawImage(obj, x, y-20, 10, 20);
                                    }
                                    ctx.stroke();
                                };
                            })(imgObj, xNotes, yNotes, sizeFlag);

                            // next x coordinate for note
                            xNotes += STEPX;
                        } else {
                            var pos = i+1;
                            alert("Unknown length note in " + pos + " lines");
                        }
                    } else {
                        var pos = i+1;
                        alert("Unknown name note in " + pos + " lines");
                    }
                }
                start = finish;
            }
        } else {
            alert("canvas-unsupported code here");
        }
    } else {
        alert("JSON is empty");
    }
}