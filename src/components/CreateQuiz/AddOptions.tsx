import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Box, FormControl, FormErrorMessage, FormLabel, IconButton, Input } from '@chakra-ui/react';
import React from 'react'
import { Control, FieldErrors, UseFormRegister, useFieldArray } from 'react-hook-form';
import { SelectType, correctAnswerOption, createQuizFormValues } from './createQuiz.validation.ts';
import ControlledSelect from '../ControlledSelect/ControlledSelect.tsx';

interface AddOptionsProps {
    index: number;
    register: UseFormRegister<createQuizFormValues>;
    control: Control<createQuizFormValues>;
    errors: FieldErrors<createQuizFormValues>;
}
export const AddOptions: React.FC<AddOptionsProps> = ({ index, register, control, errors }: AddOptionsProps) => {

    const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
        control: control,
        name: `question.${index}.options`,
    });
    return (
        <div>
            {options.map((option, optionIndex) => (
                <Box key={option.id}>
                    <FormControl id={`option`} isRequired isInvalid={errors.question && !!errors.question[index]?.options}>
                        <FormLabel>{`Option ${optionIndex + 1}`}</FormLabel>
                        <Input type="text"
                            placeholder={
                                `Option ${optionIndex + 1}`} {...register(`question.${index}.options.${optionIndex}.optionText`)
                            } />
                        <FormErrorMessage>
                            {errors.question && errors.question[index]?.options[optionIndex]?.optionText?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <IconButton aria-label="Remove Option" icon={<MinusIcon />} onClick={() => removeOption(optionIndex)} />
                </Box>
            ))}
            <IconButton aria-label="Add Option" icon={<AddIcon />} onClick={() => appendOption({ optionText: '' })} />

            <ControlledSelect<createQuizFormValues, SelectType, true>
                name={`question.${index}.correctAnswer`}
                control={control}
                label="Select correct answer"
                placeholder="Select correct answer"
                options={correctAnswerOption(options.length)}
                useBasicStyles
            />
        </div>
    )
}
