////////////////////////////////////////////////////////////////////////////////
// RcLocale.ts
// 2023. 01. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isObject } from "./Common";

export interface IRcLocale {
    // formats
    dateFormat: string;
    am: string;
    pm: string;

    // data messages
    notExistsDataField: string;
    notSpecifiedDataField: string;
    invalidFieldName: string;
    invalidRowIndex: string;
    invalidToIndex: string;
    requireSourceData: string;
    requireFilterName: string;

    // other messages
    invalidDateFormat: string,
    invalidSizeValue: string;
    invalidOuterDiv: string;
    dataMustSet: string;
    requireTableName: string;
    alreadyTableExists: string;
}

export const Locales: {[lang: string]: IRcLocale} = {};

Locales['ko'] = {
    // formats
    dateFormat: 'yyyy.MM.dd',
    am: '오전',
    pm: '오후',

    // data messages
    notExistsDataField: '존재하지 않는 필드입니다: %1',
    notSpecifiedDataField: '하나 이상의 데이터필드가 설정돼야 합니다.',
    invalidFieldName: '잘못된 데이터필드 이름입니다: %1',
    invalidRowIndex: '잘못된 데이터행 index입니다: %1',
    invalidToIndex: "잘못된 'to' index입니다.: %1",
    requireSourceData: '원본 data가 반드시 지정돼야 합니다.',
    requireFilterName: '필터 이름이 반드시 지정돼야 합니다.',

    // other messages
    invalidDateFormat: '잘못된 시간 날짜 형식입니다: %1',
    invalidSizeValue: '잘못된 Size 값입니다: %1',
    invalidOuterDiv: '잘못된 외부 div 입니다: %1',
    dataMustSet: '데이터가 먼저 설정돼야 합니다.',
    requireTableName: '테이블모델의 이름이 지정돼야 합니다.',
    alreadyTableExists: '이미 존해하는 테이블모델입니다: %1',
};

Locales['en'] = {
    // formats
    dateFormat: 'M/d/yyyy',
    am: 'AM',
    pm: 'PM',

    // data messages
    notExistsDataField: 'A data field is not exists: %1',
    notSpecifiedDataField: 'At least one datafield must be set.',
    invalidFieldName: 'Invalid field name: %1',
    invalidRowIndex: 'Invalid row index: %1',
    invalidToIndex: "Invalid 'to' index: %1",
    requireSourceData: 'A source data must be set.',
    requireFilterName: 'A filter name must be set.',

    // other messages
    invalidDateFormat: 'Invalid datetime format: %1',
    invalidSizeValue: 'Invalid size value: %1',
    invalidOuterDiv: 'Invalid outer div element: %1',
    dataMustSet: 'A data must be set first.',
    requireTableName: 'The name of table model is required.',
    alreadyTableExists: 'A table model is already exists: %1',
};

let _currLang = 'ko';
export let locale = Locales[_currLang];

export const $_setLocale = (lang: string): IRcLocale => {
    locale = Locales[_currLang = lang];
    if (!locale) locale = Locales[_currLang = 'ko'];
    return locale;
}

export const $_registerLocale = (lang: string, data: IRcLocale) => {
    if (lang && isObject(data)) {
        locale = Locales[lang] = data;        
        // 빈 항목은 'en'으로 대체 시킨다.
        if (lang !== 'en') {
            const en = Locales['en'];
            for (const p in en) {
                locale[p] = locale[p] || en[p];
            }
        }
    }
}

