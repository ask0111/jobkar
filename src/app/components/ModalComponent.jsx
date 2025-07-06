"use client";

import { useState } from "react";
import { Button, Modal, Progress } from "antd";
import ReactQuill from "react-quill";

const ModalComponent = ({
  modalOpen,
  setModalOpen,
  //   sendStatus,
  setStatus,
  status,
  isEdit,
  updateStatus,
  uploadPostImage,
  setPostImage,
  postImage,
  //   currentPost,
  //   setCurrentPost,
}) => {
  const [progress, setProgress] = useState(0);
  return (
    <>
      <Modal
        title="Create a post"
        centered
        open={modalOpen}
        // onOk={() => {
        //     setStatus("");
        //   setModalOpen(false);
        //   setPostImage("");
        //   setCurrentPost({});
        // }}
        // onCancel={() => {
        //     setStatus("");
        //   setModalOpen(false);
        //   setPostImage("");
        //   setCurrentPost({});
        // }}
        footer={[
          <Button
            // onClick={isEdit ? updateStatus : sendStatus}
            key="submit"
            type="primary"
            disabled={status.length > 0 ? false : true}
          >
            {isEdit ? "Update" : "Post"}
          </Button>,
        ]}
      >
        <div className="posts-body">
          <ReactQuill
            className="modal-input"
            theme="snow"
            value={status}
            placeholder="Share Something Useful.."
            onChange={setStatus}
          />
        </div>
      </Modal>
    </>
  );
};

export default ModalComponent;
