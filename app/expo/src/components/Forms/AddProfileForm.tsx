import React, { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from 'config/initSupabase';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import {
  CreateUserDocument,
  MutationCreateUserArgs,
} from '~/graphql/generated';
import GradientButton from '../Button/GradientButton';
import { CustomTextInput } from '../FormField/CustomTextInput';
import { AddProfileSchema, addProfileSchema } from './schema/addProfileSchema';

export default function AddProfileForm() {
  const { email, password, type } = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, control } = useForm<AddProfileSchema>({
    mode: 'onChange',
    resolver: zodResolver(addProfileSchema),
  });

  const [createUser] = useMutation(CreateUserDocument);

  const onSubmit: SubmitHandler<AddProfileSchema> = async (input) => {
    setIsSubmitting(true);

    try {
      const { error, data } = await supabase.auth.signUp({
        email: email as string,
        password: password as string,
        options: {
          data: {
            userType: type as string,
            firstName: input.firstName,
            lastName: input.lastName,
          },
        },
      });

      if (error) {
        console.warn('Supabase auth signup warning:', error.message);
      }

      if (data && data.user) {
        try {
          const createUserInput: MutationCreateUserArgs = {
            type: type as string,
            input: {
              id: data.user.id,
              email: email as string,
              password: password as string,
              firstName: input.firstName,
              lastName: input.lastName,
            },
          };

          await createUser({
            variables: {
              type: createUserInput.type,
              input: createUserInput.input,
            },
          });
        } catch (err) {
          console.warn('GraphQL createUser warning:', err);
        }
      }
    } catch (err) {
      console.warn('Profile setup exception:', err);
    }

    if ((type as string) === 'BUSINESS_OPERATOR') {
      router.replace('/business/(tabs)');
    } else {
      router.replace('/traveler/(tabs)');
    }
    setIsSubmitting(false);
  };

  return (
    <View className="items-center justify-center">
      <Controller
        control={control}
        name="firstName"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View>
              <CustomTextInput
                testID="firstName-input"
                placeholder="First Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={error?.message}
                autoComplete="given-name"
              />
            </View>
          );
        }}
      />
      <Controller
        control={control}
        name="lastName"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <CustomTextInput
              testID="lastName-input"
              placeholder="Last Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={error?.message}
              autoComplete="family-name"
            />
          );
        }}
      />
      <View testID="add-profile-btn" className="mb-12 items-center">
        <GradientButton
          onPress={handleSubmit(onSubmit)}
          title="Save"
          isSubmitting={isSubmitting}
        />
      </View>
    </View>
  );
}
