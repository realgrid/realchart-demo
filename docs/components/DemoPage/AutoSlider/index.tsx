import React, { useState, useEffect } from 'react';
import { Slider } from '@mantine/core';

export const AutoSlider = ({min, max, step, color, initValue, onChange, onChangeEnd}: {
  min:number, max:number, step:number, color:string, initValue: number, 
  onChange?: (value:number)=>void, 
  onChangeEnd?: (value:number)=>void
}) => {
  const [value, setValue] = useState<number>(initValue); // 초기 값 설정
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // setInterval의 ID를 저장하는 상태

  // Slider 값이 변경될 때마다 호출되는 함수
  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  // 컴포넌트가 처음으로 마운트될 때 실행되는 useEffect
  useEffect(() => {
    // 1초마다 Slider 값 변경
    const id = setInterval(() => {
      setValue((prevValue) => {
        let newValue = prevValue + step; // 변경할 값 설정
        if (newValue > max) {
          newValue = min; // 최대값에 도달하면 다시 최소값으로 설정
        }
        
        return newValue;
      });
    }, 1000); // 1000 밀리초마다 실행 (1초)

    // setInterval ID 저장
    setIntervalId(id);

    // 컴포넌트가 언마운트될 때 clearInterval 호출하여 메모리 누수 방지
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []); // 의존성 배열을 비워 한 번만 실행되도록 설정

  useEffect(() => {
    onChange && onChange(value);
  }, [value]);

  return (
      <Slider
        value={value}
        // onChange={(value) => { handleChange(value); }}
        onChangeEnd={(value) => { handleChange(value); }}
        min={min}
        max={max}
        step={1}
        label="Value"
        color={color}
      />
  );
}
