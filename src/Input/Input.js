import React, { useEffect, useState } from 'react';
import useDynamicRefs from 'use-dynamic-refs';

export const Input = ({count, value, style, onChange, className, pattern}) => {
  const [emptyArray, setEmptyArray] = useState([]);
  const [getRef, setRef] =  useDynamicRefs();
  const [valueEntire, setValueEntire] = useState({});

  const setOnChange = () => {
    let value = '';
    Object.values(valueEntire).forEach(el => { 
      const sign = el !== '' ? el : ' ';
      value += sign;
    })
    onChange(value);
  }

  useEffect(() => {
    const array = Array.from(Array(count).keys())
    setEmptyArray(array);
    const signs = {}
    array.forEach((_, index) => {
      signs[index+1] = '';
    })
    setValueEntire(signs)
  },[])

  useEffect(() => {
    const signs = {};
    value.split('').forEach((sign, index) => {
      signs[index + 1] = (sign !== ' ' ? sign : '')
    });
    setValueEntire(prev => {
      return ({
        ...prev,
        ...signs
      })
    });
  },[value]);
  

  const onChangeOneInput = (ev, number) => {
    const reg = new RegExp(pattern, 'g');
    const ref = getRef(number) || null;
    const sign = ev.target.value;
    const flag = reg.test(sign) || sign === '';

    if(!ref || !flag) return;
    setValueEntire(prev => {
      return ({
        ...prev,
        [number]: sign
      });
    });
  }

  useEffect(() => {
    setOnChange();
  },[valueEntire]);

  const handleFocusAndSelect = (ref) => {
    ref.current.focus();
    ref.current.select();
  }

  
  const handleMouseKeyUp = (ev, numberRef) => {
    const listKeyToOmit = [27,16,17,18,225,35,34,33,36,45,40,144];
    const reg = new RegExp(pattern);
    const key = ev.keyCode;
    const nextRef = getRef(numberRef + 1);
    const prevRef = getRef(numberRef - 1);

    if(listKeyToOmit.find(el => el === key)) return;

    if(key === 37 || key === 8) {
      if(prevRef) return handleFocusAndSelect(prevRef);
      return;
    };

    if(key === 39) {
      if(nextRef) return handleFocusAndSelect(nextRef);
      return;
    };

    const flag = reg.test(ev.key)
    if(!flag || (flag && key === 9)) {
      return;
    }
    if(nextRef) return handleFocusAndSelect(nextRef);
  };

  return (
    <>
      {emptyArray?.map((_, index) => {
        const number = index + 1

        return <input
        key={number}
        ref={setRef(number)}
        className={className}
        style={style} 
        type='text'
        name='each'
        pattern={pattern}
        maxLength={1}
        value={valueEntire[number]}
        onKeyUp={(mouseEvent) => handleMouseKeyUp(mouseEvent, number)}
        onChange={(ev) => onChangeOneInput(ev, number)}
        /> 
      })}
    </>
  )
}