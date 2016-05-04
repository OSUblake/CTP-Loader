namespace CTP {

    //export type IPromise = angular.IPromise<T>;

    

    //export interface IQService extends angular.IQService {
        
    //}

    export interface IPromise<T> extends angular.IPromise<T> {
        
    }

    // UI Router
    export type IState = angular.ui.IState;
    export type IStateProvider = angular.ui.IStateProvider;
    export type IUrlRouterProvider = angular.ui.IUrlRouterProvider;


    export type ILocation = angular.ILocationService;
    export type IDocument = angular.IDocumentService;
    export type IWindow = angular.IWindowService;
    export type IQService = angular.IQService;
    export type IHttpService = angular.IHttpService;
    export type ILogService = angular.ILogService;


    //export import ILogger = Core.ILogger;
    //export type IRootScope = angular.IRootScopeService;

    export interface IScope extends angular.IScope {
        
    }

    export interface IRootScope extends angular.IRootScopeService {
        title: string;
    }

    //export type IUploadService = angular.angularFileUpload.IUploadService;

    export interface FileReaderEventTarget extends EventTarget {
        result: ArrayBuffer;
    }

    export interface FileReaderEvent extends ProgressEvent {
        target: FileReaderEventTarget;
        //size: number;
    }
}

//declare var PSLG;

declare namespace PSLG {

    var clean: Function;
    var triangulate: Function;
    var poly: Function;
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