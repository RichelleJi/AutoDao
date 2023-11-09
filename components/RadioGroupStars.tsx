import React, { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { BsStarFill } from 'react-icons/bs';
import classNames from 'classnames';

// @ts-ignore
const RadioGroupStars = ({ items, onClickStar }) => {
  const [value, setValue] = useState('');
  const handleChange = (newValue: React.SetStateAction<string>) => {
    // @ts-ignore
    setValue(newValue);
    onClickStar(newValue);
  };

  return (
    <>
      <RadioGroup value={value}  onChange={handleChange} className="w-full my-1">
        <p className="text-center font-medium">
          Rate the strategy:
        </p>
        <RadioGroup.Label className="sr-only">Choose a option</RadioGroup.Label>
          <div className="flex flex-row-reverse justify-center gap-2">
            {[...items].reverse().map((item) => (
              <RadioGroup.Option
                key={item}
                value={item}
                className={({ active, checked }) =>
                  classNames(
                    'cursor-pointer text-gray-200',
                    'hover:text-yellow-400',
                    'peer',
                    'peer-hover:text-yellow-400',
                    active ? 'text-yellow-500' : '',
                    checked ? 'text-yellow-500' : '',
                    value >= item ? 'text-yellow-500' : ''
                  )
                }
              >
                <RadioGroup.Label as={BsStarFill} className="w-7 h-7" />
              </RadioGroup.Option>
            ))}
          </div>
      </RadioGroup>
    </>
  );
};

export default RadioGroupStars;