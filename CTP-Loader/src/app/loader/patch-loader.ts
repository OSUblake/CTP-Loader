namespace CTP.Loader {

    const module = getModule();

    export class PatchLoader {

        patches = [];

        constructor(
            private $q: IQService,
            private $http: IHttpService,
            //private logger: ILogger,
            private dstRead: dstRead) {
        }

        createPatch(file): IPromise<Patch> {

            // TEST
            var deferred = this.$q.defer();
            //var patch = new Patch();

            var canvas = document.querySelector("#mycanvas3") as HTMLCanvasElement;
            var reader = new FileReader();

            reader.onloadend = (event: FileReaderEvent) => {

                // TEST
                var patch = new Patch();

                var view = new jDataView(event.target.result, 0);
                //var pattern = new Pattern();
                var pattern = new Pattern(patch);

                this.dstRead(view, pattern);

                pattern.moveToPositive();
                pattern.drawShape(canvas);

                // TEST NO RENDER
                //this.render(pattern);

                // TEST
                patch.width = pattern.right;
                patch.height = pattern.bottom;

                //_.forEach(patch.layers, layer => layer.createPoints());
                //_.forEach(patch.layers, layer => layer.createShapes());
                _.forEach(patch.layers, layer => layer.init());

                //_.forEach(patch.layers, layer => {
                //    layer.createPoints();
                //    layer.createShapes();
                //    layer.createPSLG();
                //});


                // TEST!
                //_.forEach(patch.layers, (layer, i) => {
                //    layer._stitches = pattern._stitches[i];
                //});

                // TEST
                deferred.resolve(patch);
            }

            reader.readAsArrayBuffer(file);

            // TEST
            return deferred.promise;

        }

        render(pattern: Pattern) {

            _.forEach(pattern._stitches, layer => {

                var canvas  = document.createElement("canvas");
                var context = canvas.getContext("2d");

                canvas.className = "test-canvas";
                $("body").append(canvas);

                canvas.width  = pattern.right;
                canvas.height = pattern.bottom;

                _.forEach(layer, stitch => {

                    if (stitch.flags === StitchType.Jump ||
                        stitch.flags === StitchType.Trim ||
                        stitch.flags === StitchType.Stop) {

                        context.stroke();
                        //const color = pattern.colors[stitch.color];
                        context.beginPath();
                        context.strokeStyle = "black";
                        context.moveTo(stitch.x, stitch.y);
                    }
                    context.lineTo(stitch.x, stitch.y);
                });
                context.stroke();
            });
        }
    }

    module.service("patchLoader", PatchLoader);
}