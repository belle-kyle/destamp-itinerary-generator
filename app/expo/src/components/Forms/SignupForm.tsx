import React, { useState } from 'react';
import { Text, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { router } from 'expo-router';
import { useSignUp } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import UnselectedBusinessOwner from '../../../assets/images/businessman-unselected.svg';
import BusinessOwner from '../../../assets/images/businessman.svg';
import UnselectedTraveler from '../../../assets/images/traveler-unselected.svg';
import Traveler from '../../../assets/images/traveler.svg';
import GradientButton from '../Button/GradientButton';
import UserTypeCard from '../Card/UserTypeCard';
import { CustomTextInput } from '../FormField/CustomTextInput';
import ShowPasswordIcon from '../Icon/ShowPasswordIcon';
import BottomHalfModal from '../Modal/BottomHalfModal';
import { SignUpSchema, signUpSchema } from './schema/signupSchema';

interface ErrorJson {
  status: number;
  clerkError: boolean;
  errors: {
    code: string;
    message: string;
    longMessage: string;
    meta: {
      paramName: string;
    };
  }[];
}

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [userType, setUserType] = useState<string>('TRAVELER');
  const [clerkError, setClerkError] = useState<string | null>(null);

  const handleUserTypeChange = (value: string) => {
    setUserType(value);
  };

  const { handleSubmit, control } = useForm<SignUpSchema>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpSchema> = async (input) => {
    setClerkError(null);
    if (!isLoaded) {
      setClerkError(
        'Authentication is still initializing. Please wait a moment and try again.',
      );
      return;
    }
    if (!signUp) {
      setClerkError('Authentication is not available. Please reload the page.');
      return;
    }
    setIsSubmitting(true);

    try {
      await signUp.create({
        emailAddress: input.email,
        password: input.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err) {
      const error = err as ErrorJson;
      const message =
        error?.errors?.[0]?.message ||
        error?.errors?.[0]?.longMessage ||
        'Unknown sign-up error';
      setClerkError(message);
      console.warn('Clerk signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPressVerify: SubmitHandler<SignUpSchema> = async (input) => {
    setClerkError(null);
    setVerifying(true);

    try {
      if (!signUp) {
        throw new Error('Authentication is not available.');
      }
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp && completeSignUp.createdSessionId) {
        await setActive({ session: completeSignUp.createdSessionId });
      }

      router.push({
        pathname: '/(auth)/profile',
        params: {
          email: input.email,
          password: input.password,
          type: userType,
        },
      });
    } catch (err) {
      const error = err as ErrorJson;
      const message =
        error?.errors?.[0]?.message ||
        error?.errors?.[0]?.longMessage ||
        'Invalid or expired code';
      setClerkError(message);
      console.warn('Email verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View className="items-center">
      <View className="-top-2 w-[370]">
        <Text className="ml-2.5 self-start font-poppins text-base text-gray-500">
          Choose account type
        </Text>
        <View className="mx-1.5 flex-row justify-between px-2">
          <UserTypeCard
            selectedIcon={<Traveler height={40} width={30} />}
            unselectedIcon={<UnselectedTraveler height={40} width={30} />}
            isSelected={userType === 'TRAVELER'}
            title="Traveler"
            onPress={() => handleUserTypeChange('TRAVELER')}
          />
          <UserTypeCard
            selectedIcon={<BusinessOwner height={33} width={25} />}
            unselectedIcon={<UnselectedBusinessOwner height={33} width={25} />}
            isSelected={userType === 'BUSINESS_OPERATOR'}
            title="Business Operator"
            onPress={() => handleUserTypeChange('BUSINESS_OPERATOR')}
          />
        </View>
      </View>
      <Controller
        control={control}
        name="email"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View>
              <CustomTextInput
                testID="email-input"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                errorMessage={error?.message}
              />
            </View>
          );
        }}
      />
      <Controller
        control={control}
        name="password"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View className="flex-row">
              <CustomTextInput
                testID="password-input"
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={error?.message}
                secureTextEntry={hidePassword}
              />
              <ShowPasswordIcon
                hidePassword={hidePassword}
                onPress={() => setHidePassword(!hidePassword)}
                testID="show-password-icon"
              />
            </View>
          );
        }}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <View className="flex-row">
              <CustomTextInput
                testID="confirm-password-input"
                placeholder="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={error?.message}
                secureTextEntry={hideConfirmPassword}
              />
              <ShowPasswordIcon
                hidePassword={hideConfirmPassword}
                onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                testID="show-confirm-icon"
              />
            </View>
          );
        }}
      />
      <View testID="sign-up-btn" className="mb-6 items-center">
        <GradientButton
          onPress={handleSubmit(onSubmit)}
          title="Create Account"
          isSubmitting={isSubmitting}
        />
      </View>
      {clerkError ? (
        <View className="mb-4 w-[350] rounded-lg bg-red-50 px-3 py-2">
          <Text className="text-center font-poppins text-sm text-red-600">
            {clerkError}
          </Text>
        </View>
      ) : null}
      <BottomHalfModal
        isVisible={pendingVerification}
        onClose={() => {
          setPendingVerification(false);
          setIsSubmitting(false);
        }}
      >
        <View className="items-center">
          <Text className="mt-3 text-2xl font-bold">Email Verification</Text>
          <Text className="mt-5 text-center text-lg">
            Please enter the 6-digit code that {'\n'}
            was sent to your email.
          </Text>
        </View>
        <View className="mt-3 items-center">
          <OTPTextInput
            tintColor={'#FB2E53'}
            inputCount={6}
            handleTextChange={(code) => setCode(code)}
          />
        </View>
        <GradientButton
          onPress={handleSubmit(onPressVerify)}
          title="Verify Email"
          isSubmitting={verifying}
        />
      </BottomHalfModal>
    </View>
  );
}
