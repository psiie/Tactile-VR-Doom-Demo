// MODIFIED - Need to init rearCamera ASAP
      var rearCam;
      (function rearCamera() {
        console.log('inside rear camera')
        MediaStreamTrack.getSources(function(s) {
          // MODIFIED - Manually specified 1 as the rear camera for the S7. Should default to normal for desktop testing
          rearCam = s[1].id;
        })
      })()

      window.onload = function() {
        var video = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        // document.getElementById('video').setAttribute('style', "z-index: 1"); // Old code from old demo
        
        // ----------- Set Custom Colors & Initiate ColorTracker ---------//
        tracking.ColorTracker.registerColor('orange', function(r,g,b) {
          if (r > 190 && g > 60 && g < 130 && b > 40 && b < 100) {
            return true;
          }
          return false;
        })
        tracking.ColorTracker.registerColor('green', function(r,g,b) {
          if (r < 100 && g > 150 && b < 200) {
            return true;
          }
          return false;
        })
        tracker = new tracking.ColorTracker(['green']);
        // tracker = new tracking.ColorTracker(["cyan", "magenta", "yellow"]);
        tracker['minDimension'] = 5;
        tracker['maxDimension'] = 25;
        tracker['minGroupSize'] = 100;
        // tracker['customColor'] = "#000000";

        // ---------------------- Initiate Camera ------------------------ //

        // Initiate camera after a timeout. This is so we can grab the rear camera in time.
        // Should set this to run inside the return function of that rear camera grab fucntion
        // PS: The rear camera grab is done inside tracking.js . I know, its dirty. Will fix
        setTimeout(function() {
          tracking.track('#video', tracker, { camera: true });
        }, 1000)

        // ----------------------- Do thing On Track --------------------- //
        tracker.on('track', function(event) {
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Multi-target tracking
          event.data.forEach(function(rect) {
            if (rect.color === 'custom') {
              rect.color = tracker.customColor;
            }

            context.strokeStyle = rect.color;
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
          });

          
          // ---------------- End of Do thing On Track ------------------- //

        });


      // Turn on the Color controller (seems to be required)
      initGUIControllers(tracker);
      tracker.colors = ["green", "orange"] // DEBUG - initGUIControllers add 3 more colors. So we remove them
      };