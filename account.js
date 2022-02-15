const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const mysqlConObj = require('./config/mysql');
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const cryptoValue = require('./helpers/encryption');

const app = express();
const port = 8080;
const database = mysqlConObj.init();
mysqlConObj.open(database);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
    app.locals.isLogin = false;
    // app.locals.req_path = req.path   // url endPoint value
    next();
});

app.get('/account', function(req, res) {
    res.status(200).json({ message: "/account"});
})

// to-do: 이메일 형식 유효성 검사 / 회원탈퇴 / 회원정보 변경 / 암호화 / ctrl 분류 / sql table 형식 수정
app.post('/account/register', function(req, res) {
    const user = new User(
        req.body.email.trim(),
        req.body.password.trim(),
        req.body.display_name.trim()
    );
    const addRow = {
        // to-do: 암호화 함수 적용 - user.cryptoValue(),
        email: user.email,
        password: user.password,
        display_name: user.display_name
    };
    
    // 회원가입 email 중복체크
    const chkValue = 'email';
    const sql = `select ${ chkValue } from user_detail where email = ?`;
    database.query(sql, [addRow.email], function(err, result, fields) {
        if(!err) {
            if(!result.length) {
                // 회원가입 성공
                const sqlInsert = 'insert into user_detail set ?';
                database.query(sqlInsert, addRow, function(err, result, fields) {
                    if(!err) {
                        return res.status(200).json({ register_success: true,
                                                      message: "success"});
                    }
                    if(err) {
                        console.log(err);
                        return res.status(500).json({ register_success: false,
                                                      message: "failed" });        
                    }
                });            
            }
            if(result.length) {
                // 중복 email로 회원가입 불가
                return res.status(400).json({ register_success: false,
                                              message: "duplicated email" });
            }
        }
        if(err) {
            console.log(err);
        }
    });
});

// to-do: 암호화 / 유효성 검사 / 로그아웃
app.post('/account/login', function(req, res) {
    const loginValue = {
        email: req.body.email.trim(),
        password: req.body.password.trim()
    }

    const sql = `select email, password from user_detail where email = ?`;
    database.query(sql, [loginValue.email], function(err, result, fields) {
        if(!err) {
            try {
                if(result[0].email.length > 0) {
                    console.log(result[0].email, result[0].password)
                    if(result[0].password === loginValue.password) {
                        return res.status(200).json({ login_success: true,
                                                      message: "success" });
                    }
                    if(result[0].password !== loginValue.password) {
                        return res.status(400).json({ login_success: false,
                                                      message: "wrong password" });
                    }
                }
            } catch (error) {
                return res.status(400).json({ login_success: false,
                                              message: "wrong email address!!" });
            }
        }
        if(err) {
            console.log(err);
        }
    });    
});

app.use(function(req, res, _) {
    res.status(400).send("404 page not found!!");
});

app.use(function(req, res, _) {
    res.status(500).send("500 server error!!");
});

app.listen(port, function() {
    console.log(`Server is running on port ${ port }!!`)
})