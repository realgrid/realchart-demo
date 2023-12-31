////////////////////////////////////////////////////////////////////////////////
// ChartTypes.ts
// 2023. 08. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

/**
 * 색상 목록에서 색을 가져오는 방식.
 * 
 * @config
 */
export enum PaletteMode {
    /**
     * 순서대로 가져오고 끝에 도달하면 처음으로 돌아간다.
     */
    NORMAL = 'normal',
    /**
     * 첫 색상을 가져오기 전 항목들을 섞는다.
     */
    SHUFFLE = 'shuffle',
    /**
     * 임의 위치의 색상을 가져온다.
     */
    RANDOM = 'random'
}

/**
 * 선 표시 방식.
 * 
 * @config
 */
export enum LineType {
    /**
     * 직선.
     * 
     * @config
     */
    DEFAULT = 'default',
    /**
     * 점들을 연결하는 스플라인 곡선.
     * 
     * @config
     */
    SPLINE = 'spline',
    /**
     * 계단형 직선.
     * 
     * @config
     */
    STEP = 'step'
}
