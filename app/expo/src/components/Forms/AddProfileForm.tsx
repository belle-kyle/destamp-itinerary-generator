import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from 'config/initSupabase';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import {
  CreateUserDocument,
  GetTripsDocument,
  GetUserPoisDocument,
  MutationCreateUserArgs,
} from '~/graphql/generated';
import GradientButton from '../Button/GradientButton';
import { CustomTextInput } from '../FormField/CustomTextInput';
import { AddProfileSchema, addProfileSchema } from './schema/addProfileSchema';

export default function AddProfileForm() {
  const { email, password, userId, type } = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, control } = useForm<AddProfileSchema>({
    mode: 'onChange',
    resolver: zodResolver(addProfileSchema),
  });

  const [createUser] = useMutation(CreateUserDocument);

  const onSubmit: SubmitHandler<AddProfileSchema> = async (input) => {
    setIsSubmitting(true);

    // The Supabase account itself was already created right after email
    // verification (see SignupForm.tsx) - this step only fills in the
    // profile details for that existing account. If the Supabase project
    // still requires its own email confirmation on top of Clerk's, there's
    // no session yet at this point - the firstName/lastName below still get
    // saved via createUser, so skip this metadata update rather than block.
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      const { error } = await supabase.auth.updateUser({
        data: {
          userType: type as string,
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });

      if (error) Alert.alert('Error', error.message);
    }

    const createUserInput: MutationCreateUserArgs = {
      type: type as string,
      input: {
        id: userId as string,
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
      onError: (err) => {
        Alert.alert('Error', err.message);
      },
      refetchQueries: [
        {
          query: GetTripsDocument,
          variables: {
            userId: userId as string,
          },
        },
        {
          query: GetUserPoisDocument,
          variables: {
            userId: userId as string,
          },
        },
      ],
    });

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
