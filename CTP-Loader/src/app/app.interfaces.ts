namespace CTP {

    //export import ILogger = Core.ILogger;
    export type IHttpService = angular.IHttpService;
    export type ILogService = angular.ILogService;
    //export type IRootScope = angular.IRootScopeService;

    export interface IRootScope {
        title: string;
    }

    //export type IUploadService = angular.angularFileUpload.IUploadService;

    export interface FileReaderEventTarget extends EventTarget
    {
        result: ArrayBuffer;
    }

    export interface FileReaderEvent extends ProgressEvent {
        target: FileReaderEventTarget;
        //size: number;
    }
}


declare namespace GSAP {

    export interface Transform {
        x: number;
        y: number;
        rotation: number;
        rotationX: number;
        rotationY: number;
        scaleX: number;
        scaleY: number;
    }
}


interface Element {
    _gsTransform: GSAP.Transform;
}

declare class jDataView {

    byteLength: number;
    compatibility: {};

    constructor(buffer: ArrayBuffer, byteOffset?: number, byteLength?: number, litteEndian?: boolean);

    getUint8(): number;
    tell();
    seek(byteOffset: number);
}