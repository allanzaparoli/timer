import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonContainerProps {
  variant: ButtonVariant;
}

const buttonVariants = {
  primary: 'purple',
  secondary: 'gray',
  danger: 'red',
  success: 'green',
};

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;

  border-radius: 80px;
  border: none;
  margin: 20rem 7px 7px 7px;

  background-color: ${props => props.theme['green-500']};

  /* ${ props => {
    return css`background-color: ${buttonVariants[props.variant]}`
  }} */
  `
