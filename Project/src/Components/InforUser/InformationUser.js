import React, { useState } from 'react'
import propTypes from "prop-types";
import { useEffect } from 'react';
import axios from 'axios'
import EditIcon from '@mui/icons-material/Edit';
import ChangePassword from '../ChangePassword'
import { LocalhostApi } from '../../API/const'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = yup.object().shape({
    full_name: yup.string().required('Vui lòng nhập đầy đủ họ tên'),
    email: yup.string().email('Không phải là một email').max(255).required('Vui lòng nhập email của bạn')
});

export default function InformationUser(props) {
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(schema),
    });
    const { errors } = formState;
    const [disable, setDisable] = useState(true)
    const [edit, setedit] = useState('Edit')
    const [Account, setAccount] = useState({})
    const [Temp, setTemp] = useState({})
    const [cancel, setCancel] = useState(false)
    useEffect(() => {
        let isActive = false
        if (!isActive) {
            axios.get(
                LocalhostApi + 'infor?username=' + props.account)
                .then(res => {

                    setTemp({
                        username: res.data.account.username,
                        full_name: res.data.account.full_name,
                        email: res.data.account.user.email,
                        password: '123',
                        avatar: res.data.account.avatar,
                        total_comment: res.data.total_comment,
                        evalute: res.data.evalute
                    })
                    setAccount({
                        username: res.data.account.username,
                        full_name: res.data.account.full_name,
                        email: res.data.account.user.email,
                        password: '123',
                        avatar: res.data.account.avatar,
                        total_comment: res.data.total_comment,
                        evalute: res.data.evalute,
                    })
                })
        }
        return () => {
            isActive = true;
        }
    }, [cancel])
    function EditInfor() {
        setCancel(pre => !pre)
        setDisable(pre => !pre)
        if (edit === 'Edit') {
            setedit('Cancel')
        }
        else {
            setedit('Edit')
        }
    }
    const uploadedImage = React.useRef(null);
    const imageUploader = React.useRef(null);
    const [data, setData] = useState({
        full_name: "",
        email: "",
        avatar: '',
    });
    function handle(e) {
        const newData = { ...data };
        newData[e.target.id] = e.target.value;
        setData(newData);
    }
    const onSubmit = (data) => {
        let avatar = { avatar: uploadedImage.current.currentSrc }
        let acc = { user: props.account }
        let editInfoUser = { ...data, ...avatar, ...acc }
        setDisbutton(true)
        axios.post(LocalhostApi + 'infor', editInfoUser)
            .then((data) => {
                if (data.data.success) {
                    toast.success('Cập nhật thông tin thành công!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setDisbutton(false)
                }
                else {
                    setErrors(data.data.mgs)
                }
            })
    }
    const [changePass, setChangPass] = useState(false)
    const handleImageUpload = (e) => {
        const [file] = e.target.files;
        if (file) {
            const reader = new FileReader();
            const { current } = uploadedImage;
            current.file = file;
            reader.onload = (e) => {
                current.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    const [disbutton, setDisbutton] = useState(false)
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <ChangePassword open={changePass} setChangPass={setChangPass} account={Account.username} />
            <div className="information-detail">
                <div className="information-imge-user">
                    <button className="information-imge-user-change" onClick={() => imageUploader.current.click()}>
                        <span>Tải ảnh lên</span>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleImageUpload}
                            ref={imageUploader}
                            style={{ display: "none" }}
                        />
                    </button>
                    {edit !== 'Edit' ?
                        <img ref={uploadedImage} src={Account.avatar} alt="no img" />
                        :
                        <img ref={uploadedImage} src={Temp.avatar} alt="no img" />}
                    <div className="image-user-interact">
                        <span>{Account.total_comment} comments</span>
                        <span>{Account.evalute} evaluted</span>
                    </div>
                </div>
                <div className="information-infor-user">
                    <h1>Hồ sơ cá nhân</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="infor-user-details">
                            <h2>Họ và tên:</h2>
                            {edit !== 'Edit' ?
                                <input {...register("full_name")}
                                    onChange={(e) => handle(e)}
                                    id="full_name" disabled={disable} type="text"
                                    name="full_name"
                                    defaultValue={Account.full_name}
                                    {...register('full_name')} />
                                :
                                <span>{Temp.full_name}</span>}
                        </div>
                        <p>{errors.full_name?.message}</p>
                        <div className="infor-user-details">
                            <h2>Tên đăng nhập:</h2>
                            <span>{Temp.username}</span>
                        </div>
                        <div className="infor-user-details">
                            <h2>Email:</h2>
                            {edit !== 'Edit' ?
                                <input {...register("email")}
                                    onChange={(e) => handle(e)} id="email"
                                    disabled={disable} type="text"
                                    name="email"
                                    defaultValue={Account.email}
                                    {...register('email')} />
                                :
                                <span>{Temp.email}</span>}

                        </div>
                        <p>{errors.email?.message}</p>
                        <div className="infor-user-details">
                            <h2>Mật Khẩu:</h2>
                            <button type="button" className="btn-info" onClick={() => setChangPass(true)}><EditIcon fontSize="medium" />Thay đổi mật khẩu</button>
                        </div>
                        <div className="button-edit-information">
                            {(edit === 'Edit') ?
                                <button type="button" className="btn-info" onClick={EditInfor}>Chỉnh sửa</button>
                                :
                                <button type="button" className="cancel-edit" onClick={EditInfor}>Hủy bỏ</button>
                            }
                            {(edit !== "Edit") ?
                                <button type="submit" className="btn-info" disabled={disbutton}>
                                    {disbutton && (
                                        <i
                                            className="fa fa-refresh fa-spin"
                                            style={{ marginRight: "5px" }}
                                        />
                                    )}
                                    Lưu
                                </button>
                                : null}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

InformationUser.propTypes = {
    account: propTypes.string.isRequired,
};
