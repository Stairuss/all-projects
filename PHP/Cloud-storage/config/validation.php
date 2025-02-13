<?php

namespace config;

class validation
{
    public static array $userData = [];

    public static function valid(string $page): array
    {
        foreach ($_POST as $key => $value) {
            if (empty($value)) {
                require_once $page;
                warningMessage('Заполните все поля');
                die;
            }
            switch ($key) {
                case 'name':
                    if (preg_match_all('/[^а-я\s]/ui', $value)) {
                        require_once $page;
                        errorMessage("Поле <strong>'Имя'</strong> может содержать только буквы русского алфавита");
?>
                        <style>
                            .input-name {
                                border-color: var(--red);
                            }

                            .input-name:focus {
                                outline: 1px solid var(--red);
                            }
                        </style>
                    <?php
                        die;
                    } elseif (mb_strlen($value) <= 2) {
                        require_once $page;
                        warningMessage("Поле Имя не может содержать меньше двух символов");
                        die;
                    } else {
                        $name = preg_replace('/\s/', '', $value);
                        preg_match('/^./u', $name, $matchesName);
                        $firstCharacter = mb_strtoupper($matchesName[0]);
                        self::$userData['name'] = preg_replace('/^./u', $firstCharacter, $name);
                    }
                    break;
                case 'age':
                    if (preg_match_all('/[\D]/ui', $value)) {
                        require_once $page;
                        errorMessage("Поле Возраст может содержать только цифры");
                    ?>
                        <style>
                            .input-age {
                                border-color: var(--red);
                            }

                            .input-age:focus {
                                outline: 1px solid var(--red);
                            }
                        </style>
                    <?php
                        die;
                    }elseif(strlen($value) != 2) {
                        require_once $page;
                        errorMessage("Возраст должен состоять из двух цифр");
                    ?>
                        <style>
                            .input-age {
                                border-color: var(--red);
                            }

                            .input-age:focus {
                                outline: 1px solid var(--red);
                            }
                        </style>
                    <?php
                        die;
                    } else {
                        self::$userData['age'] = $value;
                    }
                    break;
                case 'gender': {
                        self::$userData['gender'] = $value;
                        break;
                    }
                case 'email':
                    if (!preg_match('/^[a-z]([a-z0-9]+\.?)*[a-z0-9]*@[a-z]+\.[a-z]+/ui', $value, $matchesEmail)) {
                        require_once $page;
                        errorMessage("Введен неверный формат электронной почты");
                    ?>
                        <style>
                            .input-email {
                                border-color: var(--red);
                            }

                            .input-email:focus {
                                outline: 1px solid var(--red);
                            }
                        </style>
                    <?php
                        die;
                    } else {
                        require_once $page;
                        self::$userData['email'] = $value;
                    }
                    break;
                case 'old_password':
                    if (!preg_match_all('/^(([a-z]+[0-9]+)+|([0-9]+[a-z]+)+)/', $value)) {
                        require_once $page;
                        errorMessage("Пароль должен состоять только из латинских букв и цифр");
                    ?>
                        <style>
                            .input-old-pass {
                                border-color: var(--red);
                            }

                            .input-old-pass:focus {
                                outline: 1px solid var(--red);
                            }
                        </style>
                    <?php
                        die;
                    } elseif (strlen($value) <= 6) {
                        require_once $page;
                        errorMessage("Пароль должен содержать миниум 6 символов");
                    ?>
                        <style>
                            .input-pass {
                                border-color: var(--red);
                            }

                            .input-pass:focus {
                                outline: 1px solid var(--red);
                            }
                        </style>
<?php
                        die;
                    } else {
                        self::$userData['old_password'] = $value;
                    }
                    break;                    
                case 'password':
                    if (!preg_match_all('/^(([a-z]+[0-9]+)+|([0-9]+[a-z]+)+)/', $value)) {
                        require_once $page;
                        errorMessage("Пароль должен состоять только из латинских букв и цифр");
                    ?>
                        <style>
                            .input-pass {
                                border-color: var(--red);
                            }

                            .input-pass:focus {
                                outline: 1px solid var(--red);
                            }
                        </style>
                    <?php
                        die;
                    } elseif (strlen($value) <= 6) {
                        require_once $page;
                        errorMessage("Пароль должен содержать миниум 6 символов");
                    ?>
                        <style>
                            .input-pass {
                                border-color: var(--red);
                            }

                            .input-pass:focus {
                                outline: 1px solid var(--red);
                            }
                        </style>
<?php
                        die;
                    } else {
                        self::$userData['password'] = $value;
                    }
                    break;                    
                case 'repeat_password':
                    if (!preg_match_all('/^(([a-z]+[0-9]+)+|([0-9]+[a-z]+)+)/', $value)) {
                        require_once $page;
                        errorMessage("Пароль должен состоять только из латинских букв и цифр");
                    ?>
                        <style>
                            .input-repeat-pass {
                                border-color: var(--red);
                            }

                            .input-repeat-pass:focus {
                                outline: 1px solid var(--red);
                            }
                        </style>
                    <?php
                        die;
                    } elseif (strlen($value) <= 6) {
                        require_once $page;
                        errorMessage("Пароль должен содержать миниум 6 символов");
                    ?>
                        <style>
                            .input-pass {
                                border-color: var(--red);
                            }

                            .input-pass:focus {
                                outline: 1px solid var(--red);
                            }
                        </style>
<?php
                        die;
                    } else {
                        self::$userData['repeat_password'] = $value;
                    }
                    break;                    
            }
        }
        return self::$userData;
    }
}
