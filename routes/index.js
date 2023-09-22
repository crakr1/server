const express = require('express'); 
const userController = require('../controller/userController')
const postController = require('../controller/postController')
const isLoggedIn = require('../middlewares/authentication')
const {userValidationRules, validate, updateUserValidationRules, postValidationRules} = require('../middlewares/validtr')
const upload = require('../middlewares/upload')


const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: "helo ther"
    })
})

router.post('/account/register',userValidationRules(), validate, userController.register)
router.post('/account/login', userController.login)
router.get('/account/profile', isLoggedIn, userController.getProfile)
router.put('/account/profile/upload-photo', upload.single('avatar'), isLoggedIn, userController.uploadUserPhoto)
router.put('/account/profile/update', updateUserValidationRules(), validate,isLoggedIn, userController.updateProfile)

router.post('/post/create',upload.array('postImg', 5), postValidationRules(), validate, isLoggedIn, postController.newPost)
router.get('/posts', isLoggedIn, postController.getAllPosts)
router.get('/posts/:PostId  ', isLoggedIn, postController.getPost)
router.get('/my-post', isLoggedIn, postController.myAllPosts)
router.get('/my-post/:PostId', isLoggedIn, postController.getMyPost)
router.put('/my-post/:PostId/update', postValidationRules(),validate,isLoggedIn,  postController.updateMyPost)
router.delete('/my-post/delete', isLoggedIn, postController.deleteMyPost)

module.exports = router 