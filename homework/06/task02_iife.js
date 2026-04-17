// @ts-check

/**
 * 現代進階 IIFE (立即執行函數) 模組化實踐
 * 將沙盒環境與全局環境顯式隔離，並傳入 globalThis 作為依賴注入
 */
((globalScope) => {
    'use strict';

    // 內部封閉變數，外部無法存取，完全避免命名污染
    const currentCountValue = 100;

    console.log(`[IIFE Sandbox] Count initialized to: ${currentCountValue}`);

    // 展示如何有控制地向外部暴露安全 API，避免命名空間污染
    globalScope.appSandboxModule = {
        getVersion: () => "1.0.0",
        readOnlyCount: currentCountValue
    };

})(typeof globalThis !== 'undefined' ? globalThis : this);