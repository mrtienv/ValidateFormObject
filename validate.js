//Đối tượng Validator
function Validator(options) {
    //Để chứa các rules nếu 1 trường input có nhiều rule
    let selectorRules = {}
    //Hàm thực hiện validate
    function Validate(inputEl, rule) {

        let errorMessage;
        let errorEl = inputEl.parentElement.querySelector(options.errorSelector);
        //Lấy ra các rules của selector
        let rules = selectorRules[rule.selector];
        //Lặp qua các rules của selector và kiểm tra
        //Nếu có lỗi thì break
        for(let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputEl.value)
            if (errorMessage) break
        }
        if (errorMessage){
            errorEl.textContent = errorMessage;
            inputEl.parentElement.classList.add('invalid')
        } else {
            errorEl.textContent = '';
            inputEl.parentElement.classList.remove('invalid')
        }
        //Thêm 2 dấu !! để chuyển errorMessage thành dạng boolean
        return !!errorMessage
    }

    //Lấy element form cần validate
    let formEl = document.querySelector(options.form);
    if (formEl) {
        //Khi submit form
        formEl.onsubmit = function (e) {
            e.preventDefault();
            let isValid = true;
            //Lặp qua từng rule và validate
            options.rule.forEach(function (rule){
                let inputEl = formEl.querySelector(rule.selector);
                Validate(inputEl, rule);
            });
        }

        //Lặp qua mỗi rule và xử lý
        options.rule.forEach(function (rule){
            //Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            // selectorRules[rule.selector] = rule.test;


            let inputEl = formEl.querySelector(rule.selector)
            if (inputEl) {
                //xử lý trường hợp blur khỏi input
                inputEl.onblur = function() {
                    Validate(inputEl, rule);
                }
                //xử lý trường hợp khi người dùng đang nhập => xoá message lỗi
                inputEl.oninput = function() {
                    let errorEl = inputEl.parentElement.querySelector(options.errorSelector);
                    errorEl.textContent = '';
                    inputEl.parentElement.classList.remove('invalid')
                }
            }
        })
    }
}


//Định nghĩa các RULES
//Nguyên tắc rule:
// 1. Khi có lỗi => trả về message lỗi
// 2. Khi hợp lệ => trả về undefined
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function (value){
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    };
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function (value){
            let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    };
}

Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function (value){
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    };
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value){
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    };
}