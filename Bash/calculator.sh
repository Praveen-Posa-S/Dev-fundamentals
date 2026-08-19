#!/bin/bash

add() {
    result=$((num1 + num2))
    echo "Sum = $result"
}

subtract() {
    result=$((num1 - num2))
    echo "Difference = $result"
}

multiply(){
    result=$((num1 * num2))
    echo "Product = $result"
}

echo "Simple Calculator"
echo "1. Addition"
echo "2. Subtraction"
echo "3. Multiplication"

read -p "Choose an option (1 / 2 / 3): " choice

read -p "Enter first number: " num1
read -p "Enter second number: " num2


case $choice in
    1)
        add
        ;;
    2)
        subtract
        ;;
    
    3)
        multiply
        ;;

    *)
        echo "Invalid choice!"
        ;;
esac