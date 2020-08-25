const x11 = require('x11');
const {Exposure, PointerMotion} = x11.eventMask;

function createClient(err, display) {
    if (!err) {
        let X = display.client;
        let root = display.screen[0].root;
        let wid = X.AllocID();
        X.CreateWindow(
            wid, root,        // new window id, parent
            0, 0, 100, 100,   // x, y, w, h
            0, 0, 0, 0,       // border, depth, class, visual
            { eventMask: Exposure|PointerMotion } // other parameters
        );
        X.MapWindow(wid);
        let gc = X.AllocID();
        X.CreateGC(gc, wid);
        X.on('event', function(ev) {
            if (ev.type == 12)
            {
                X.PolyText8(wid, gc, 50, 50, ['Hello, Node.JS!']);
            }
        });
        X.on('error', function(e) {
            console.log(e);
        });
    } else {
        console.log(err);
    }
}

x11.createClient(createClient);