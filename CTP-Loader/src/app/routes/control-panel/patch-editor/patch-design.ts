namespace CTP.routes.controlPanel {

    const module = getModule();

    let patches = [
        "ohio 4in.DST", // 0
        "A06inch.DST", // 1
        "B.DST", // 2
        "football border.DST", // 3
        "football.DST", // 4
        "GONZAGA.DST", // 5
        "leprechaun 5in.DST", // 6
        "O 5 INCH.DST", // 7
        "ohio 4in.DST", // 8
        "ohio state border.DST" // 9
    ].map(patch => `patches/${patch}`);
    

    class PatchDesign {

        currentShape;
        currentLayer;

        patch: Loader.Patch = null;

        constructor(
            private $http: IHttpService,
            private patchLoader: Loader.PatchLoader) {

        }

        editShape(shape, layer) {
            this.currentShape = shape;
            this.currentLayer = layer;
        }

        updateLayer() {
            this.currentLayer.updateShape();
        }

        loadPatch() {

            this.patch = null;

            this.$http({
                method: "GET",
                url: patches[6],
                responseType: "arraybuffer"
            }).then(
                response => {
                    this.patchLoader
                        .createPatch(new Blob([response.data]))
                        .then(
                        response => {
                            this.patch = response;
                            console.log("PATCH LOADED\n", this.patch);
                        },
                        reponse => console.error("Load patch", response.data || "Request failed"));
                },
                response => {
                    console.error("Load patch", response.data || "Request failed");
                });

        }
    }

    module.controller("PatchDesign", PatchDesign);

    module.component("patchDesign", {
        //template: "<h1>Patch Design</h1>",
        templateUrl: "app/routes/control-panel/patch-editor/patch-design.html",
        controller: "PatchDesign"
    });
}