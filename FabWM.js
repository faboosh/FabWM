const x11 = require('x11');
const {Exposure, PointerMotion} = x11.eventMask;
const {exec} = require('child_process');

function createClient(err, display) {
    if (!err) {
        let X = display.client;
        let root = display.screen[0].root;
        let wid = X.AllocID();
        X.CreateWindow(
          wid,
          root, // new window id, parent
          0,
          0,
          500,
          500, // x, y, w, h
          0,
          0,
          0,
          0, // border, depth, class, visual
          { eventMask: Exposure | PointerMotion } // other parameters
        );
        X.MapWindow(wid);
        let gc = X.AllocID();
        X.CreateGC(gc, wid);
        let white = display.screen[0].white_pixel;
        let black = display.screen[0].black_pixel;
        cidBlack = X.AllocID();
        cidWhite = X.AllocID();
        X.CreateGC(cidBlack, wid, { foreground: black, background: white });
        X.CreateGC(cidWhite, wid, { foreground: white, background: black });
        X.on('event', function(ev) {
          if (ev.type == 12) {
            X.PolyFillRectangle(wid, cidWhite, [0, 0, 500, 500]);
            X.PolyText8(wid, cidBlack, 50, 50, ['Hello, Node.JS!']);
          }
        });
        X.on('error', function(e) {
          console.log(e);
        });
        exec('alacritty');
      } else {
        console.log(err);
      }
}

x11.createClient(createClient);