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
    invalidFieldIndex: string;
    invalidRowIndex: string;
    canNotModifyData: string;
    canNotModifyDeleted: string;
    requiredField: string;
    invalidValueInDomain: string;
    invalidValueInRange: string;
    invalidToIndex: string;
    requireSourceData: string;
    requireFilterName: string;
    alreadyEditing: string;

    // other messages
    invalidDateFormat: string,
    invalidSizeValue: string;
    invalidOuterDiv: string;
    canNotHorzGrouping: string;
    dataMustSet: string;
    requireGroupingInfos: string;
    canNotRowGrouping: string;
    canNotDataGrouping: string;
    canNotHorzInGrouping: string;
    unknownLayoutType: string;
    layoutMustSet: string;
    unknownItemViewType: string;
    requireCommandName: string;
    commandNameDuplicated: string;
    requireDataOrGroup: string;
    requireTableName: string;
    alreadyTableExists: string;
    selectEditRowFirst: string;
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
    invalidFieldIndex: '잘못된 데이터필드 index입니다: %1',
    invalidRowIndex: '잘못된 데이터행 index입니다: %1',
    canNotModifyData: '읽기 전용 데이터를 변경할 수 없습니다.',
    canNotModifyDeleted: '삭제 상태 행을 변경할 수 없습니다: %1',
    requiredField: '반드시 값을 지정해야 하는 필드입니다: %1',
    invalidValueInDomain: '값이 필드 값 도메인에 포함되지 않습니다: %1',
    invalidValueInRange: '값이 필드 값 범위에 포함되지 않습니다: %1',
    invalidToIndex: "잘못된 'to' index입니다.: %1",
    requireSourceData: '원본 data가 반드시 지정돼야 합니다.',
    requireFilterName: '필터 이름이 반드시 지정돼야 합니다.',
    alreadyEditing: '이미 데이터 편집 중입니다.',

    // other messages
    invalidDateFormat: '잘못된 시간 날짜 형식입니다: %1',
    invalidSizeValue: '잘못된 Size 값입니다: %1',
    invalidOuterDiv: '잘못된 외부 div 입니다: %1',
    canNotHorzGrouping: '수평 모드일 때 그룹핑할 수 없습니다.',
    dataMustSet: '데이터가 먼저 설정돼야 합니다.',
    requireGroupingInfos: '하나 이상의 행 그룹핑 정보가 설정돼야 합니다.',
    canNotRowGrouping: '데이터링크 view에 대해 행그룹핑 할 수 없습니다. dataGroupBy()를 사용하세요.',
    canNotDataGrouping: '데이터링크 view가 아니면 데이터그룹핑할 수 없습니다. rowGroupBy()를 사용하세요.',
    canNotHorzInGrouping: '그룹핑 상태일 때 수평모드로 변경할 수 없습니다.',
    unknownLayoutType: '잘못된 layout 종류입니다: %1',
    layoutMustSet: '레이아웃 모델이 반드시 설정돼야 합니다.',
    unknownItemViewType: '잘못된 item view 종류입니다: %1',
    requireCommandName: 'Command 이름이 지정돼야 합니다.',
    commandNameDuplicated: '이미 존재하는 command 이름입니다: %1',
    requireDataOrGroup: '데이터소스나 그룹 모델이 반드시 지정돼야 합니다.',
    requireTableName: '테이블모델의 이름이 지정돼야 합니다.',
    alreadyTableExists: '이미 존해하는 테이블모델입니다: %1',
    selectEditRowFirst: '수정하거나 삽입할 행을 먼저 선택하세요.',
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
    invalidFieldIndex: 'Invalid field index: %1',
    invalidRowIndex: 'Invalid row index: %1',
    canNotModifyData: 'Can not modify a readonly data.',
    canNotModifyDeleted: 'Can not modify a deleted row: %1',
    requiredField: 'Required field: %1',
    invalidValueInDomain: 'The value is not int the domain: %1',
    invalidValueInRange: 'The value is not int the range: %1',
    invalidToIndex: "Invalid 'to' index: %1",
    requireSourceData: 'A source data must be set.',
    requireFilterName: 'A filter name must be set.',
    alreadyEditing: 'DataView is already editing.',

    // other messages
    invalidDateFormat: 'Invalid datetime format: %1',
    invalidSizeValue: 'Invalid size value: %1',
    invalidOuterDiv: 'Invalid outer div element: %1',
    canNotHorzGrouping: 'Can not row grouping in horz mode.',
    dataMustSet: 'A data must be set first.',
    requireGroupingInfos: 'At least one grouping info must be set.',
    canNotRowGrouping: 'Can not row grouping by data link view. use dataGroupBy().',
    canNotDataGrouping: 'Can not data grouping without data link view. rowGroupBy()를 사용하세요.',
    canNotHorzInGrouping: 'Can not change to horz mode while grouping',
    unknownLayoutType: 'Invalid layout: %1',
    layoutMustSet: 'A layout model must be set.',
    unknownItemViewType: 'Unknow item view type: %1',
    requireCommandName: 'Command name must be supplied.',
    commandNameDuplicated: 'Command name is already exists: %1',
    requireDataOrGroup: 'A data or group view must be set.',
    requireTableName: 'The name of table model is required.',
    alreadyTableExists: 'A table model is already exists: %1',
    selectEditRowFirst: 'First select the row you want to edit or insert.',
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

