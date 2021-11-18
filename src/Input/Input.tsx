import React, { ReactType, useEffect, useState } from 'react';
import { fileURLToPath } from 'url';
import useDynamicRefs from 'use-dynamic-refs';

type FormatDate = 'dd-mm-yyyy' | 'yyyy-mm-dd';

interface Props {
  count: number;
  value: string;
  onChange: (arg: string) => void;
  pattern: RegExp;
  className?: string;
  style?: React.CSSProperties;
  formatDate?: FormatDate;
}

enum TypeKey {
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  Backspace = 'Backspace',
  Shift = 'Shift',
  Tab = 'Tab',
}

type TypeObjectKeys = {[key: number | string]: string}

export const Input = ({count, value, style, onChange, className, pattern, formatDate}: Props) => {
  const [getRef, setRef] =  useDynamicRefs();

  const [emptyArray, setEmptyArray] = useState<Array<string | number>>([]);
  const [valueEntire, setValueEntire] = useState<{[key: number]: string}>({});
  const [indexSignDate, setIndexSignDate] = useState<Array<number>>([]);

  const initObjFields = (): TypeObjectKeys => {
    const array = Array.from(Array(count).keys());
    const fields: TypeObjectKeys = {};

    array.forEach((_,index) => {
      fields[index + 1] = ''
    });

    setEmptyArray(array);
    setValueEntire(fields);
    return fields;
  }

  const init = () => {
    formatDate?.split('').forEach((el, index) => {
      if(el === '-' || el === '/') {
        setIndexSignDate(prev => [...prev, index-1-prev.length]);
      };
    }); 
  };

  useEffect(() => {
    init();
  },[]);

  useEffect(() => {
    const signs = value.split('');
    const obj: TypeObjectKeys = initObjFields();

    Object.keys(obj).forEach((field, index) => {
      const sign = signs[index];
      setValueEntire(prev => {
        return ({
          ...prev,
          [field]: sign && sign !== ' ' ? sign : '' ,
        });
      });
    });
  },[value]);

  const addLetter = (string: string, number?: number, sign?: string) => {
    const signs: TypeObjectKeys = {}
    const array = Array.from(Array(count).keys());
    array.forEach((_, index) => {
      if(index + 1 === number && sign !== undefined) {
        signs[index + 1] = sign;
        return;
      }
      signs[index + 1] = string.split('')[index] ?? ''
    });
    let entireValue = ''
    Object.keys(signs).forEach((field, index) => {
        entireValue += signs[field as string];
    });
    onChange(entireValue.trim());
  }

  const onChangeOneInput = (ev: React.ChangeEvent<HTMLInputElement>, number: number) => {
    const reg = new RegExp(pattern); 
    const ref = getRef(String(number)) || null;
    const sign = ev.target.value;
    const flag = reg.test(sign) || sign === '';
    
    if(!ref || !flag) return;
    addLetter(value, number, sign)
  };

  const handleFocusAndSelect = (numberRef: number) => {
    const ref:any = getRef(String(numberRef));
    if(!ref) return;
    ref.current?.focus();
    ref.current?.select();
  }

  const handleMouseKeyUp = (ev: React.KeyboardEvent<HTMLInputElement>, numberRef: number) => {
    const listKeyToOmit = [TypeKey.Shift];
    const reg = new RegExp(pattern);
    const key = ev.key;

    if(listKeyToOmit.some(el => el === key)) return;
    if(key === TypeKey.ArrowLeft || key === TypeKey.Backspace) {
      return handleFocusAndSelect(numberRef - 1);
    };
    
    if(key === TypeKey.ArrowRight) {
      return handleFocusAndSelect(numberRef + 1);
    };

    const flag = reg.test(key);

    if(!flag || (flag && key === TypeKey.Tab)) return;
    return handleFocusAndSelect(numberRef + 1);
  }

  return (
    <>
      {emptyArray?.map((_, index) => {
        const number = index + 1;
        const ref: any = setRef(String(number));
        let separate = false;
        if(indexSignDate.includes(index)) separate = true;
        
        return <span key={number}>
            <input
              ref={ref}
              className={className}
              style={style}
              type='text'
              maxLength={1}
              value={valueEntire[number]}
              onKeyUp={(mouseEvent) => handleMouseKeyUp(mouseEvent, number)}
              onChange={(ev) => onChangeOneInput(ev, number)}
            />{separate && <span> {index} </span>}
          </span>
      })}
    </>
  )
}