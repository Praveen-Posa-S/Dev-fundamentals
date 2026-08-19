#!/bin/bash

add() {
    result=$((num1 + num2))
    echo "Sum = $result"
}

subtract() {
    result=$((num1 - num2))
    echo "Difference = $result"
}

echo "Simple Calculator"
echo "1. Addition"
echo "2. Subtraction"

read -p "Choose an option (1 or 2): " choice

read -p "Enter first number: " num1
read -p "Enter second number: " num2

case $choice in
    1)
        add
        ;;
    2)
        subtract
        ;;
    *)
        echo "Invalid choice!"
        ;;
esac