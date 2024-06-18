import React, { useEffect, useState } from 'react'

export type PasswordRequirements = {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    specialCharacter: boolean;
    filled: string | boolean;
}

const usePassword = (passwordInput: string, confirmPasswordInput?: string) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [hide, setHide] = useState({
        password: true,
        confirmPassword: true
    });
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
    const [passwordStr, setPasswordStr] = useState<string>('');
    const [strengthColor, setStrengthColor] = useState<string>('slate-400');
    const [barWidth, setBarWidth] = useState<string>('w-0');
    const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialCharacter: false,
        filled: 'no'
    });

    useEffect(() => {
        const calculatePasswordStrength = (password: string): void => {
          let strength: number = 0;
    
          if (password) {
    
            // mudando força da senha de acordo com requisitos mínimos:
            if (password.length >= 6) strength += 1;
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[a-z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password) || /[@$!%*#?&]/.test(password)) strength += 1;
            if (password.length >= 12) strength += 1;
    
            // verificando força da senha para passar feedback visual:
            switch (strength) {
              case 0:
                break;
              case 1:
                setPasswordStr('muito fraca');
                setBarWidth('20%');
                setStrengthColor('#ff0000');
                break;
              case 2:
                setPasswordStr('fraca');
                setBarWidth('40%');
                setStrengthColor('#ffa00a');
                break;
              case 3:
                setPasswordStr('boa');
                setBarWidth('60%');
                setStrengthColor('#fdec12');
                break;
              case 4:
                setPasswordStr('forte');
                setBarWidth('80%');
                setStrengthColor('#51ff2e');
                break;
              case 5:
                setPasswordStr('muito forte');
                setBarWidth('100%');
                setStrengthColor('#21e600');
                break;
              default:
                break;
            }
    
          } else {
            strength = 0;
            setPasswordStr('');
            setBarWidth('0%');
            setStrengthColor('slate-400');
          }
        }
    
        const checkPasswordRequirements = (password: string): void => {
          let reqNum: number = 0;
    
          if (password) {
    
            // mudando força da senha de acordo com requisitos mínimos:
            if (password.length >= 6) {
              reqNum += 1;
              passwordRequirements.length = true;
            } else {
              passwordRequirements.length = false;
            }
    
            if (/[A-Z]/.test(password)) {
              reqNum += 1;
              passwordRequirements.uppercase = true
            } else {
              passwordRequirements.uppercase = false;
            }
    
            if (/[a-z]/.test(password)) {
              reqNum += 1;
              passwordRequirements.lowercase = true
            } else {
              passwordRequirements.lowercase = false;
            }
    
            if (/[0-9]/.test(password)) {
              reqNum += 1;
              passwordRequirements.number = true
            } else {
              passwordRequirements.number = false;
            }
    
            if (/[@$!%*#?&]/.test(password)) {
              reqNum += 1;
              passwordRequirements.specialCharacter = true
            } else {
              passwordRequirements.specialCharacter = false;
            }
    
    
            // verificando força da senha para passar feedback visual:
            switch (reqNum) {
              case 1:
                passwordRequirements.filled = false;
                break;
              case 2:
                passwordRequirements.filled = false;
                break;
              case 3:
                passwordRequirements.filled = false;
                break;
              case 4:
                passwordRequirements.filled = false;
                break;
              case 5:
                passwordRequirements.filled = true;
            }
    
          } else {
            reqNum = 0;
            setPasswordRequirements({
              length: false,
              uppercase: false,
              lowercase: false,
              number: false,
              specialCharacter: false,
              filled: 'no'
            })
          }
    
        }
    
        checkPasswordRequirements(passwordInput);
        calculatePasswordStrength(passwordInput);
    
      }, [passwordInput]);
    
      useEffect(() => {
        const comparePasswords = (): void => {
          passwordInput === confirmPasswordInput ? setPasswordsMatch(true) : setPasswordsMatch(false);
        }
        comparePasswords();
      }, [confirmPasswordInput, passwordInput]);

    return {
        loading,
        setLoading,
        hide,
        setHide,
        passwordsMatch,
        passwordStr,
        strengthColor,
        barWidth,
        passwordRequirements
    }

}

export default usePassword