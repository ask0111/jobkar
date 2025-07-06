import { Card, Avatar, Typography, Row, Col, Divider } from "antd";
import moment from "moment";

const { Title, Paragraph } = Typography;

const JobCard = ({ job }) => {
  // Format the created_at time using moment.js for relative time
  const relativeTime = moment(job.created_at).fromNow();

  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        {/* <Col span={4}>
          <Avatar size={45} style={{ backgroundColor: "#87d068" }}>
            {job.job_post.company.name[0]}
          </Avatar>
        </Col> */}
        <Col span={24}>
          <Title level={4}>{job.job_post?.title}</Title>
          <p>
            <strong>Company:</strong> {job.job_post?.company?.name}
          </p>
          {/* <p>
            <strong>Status:</strong> {job.status}
          </p> */}
          <p>
            <strong>Salary:</strong> {job.job_post?.min_salary} -{" "}
            {job.job_post?.max_salary}
          </p>
          <Paragraph className=" line-clamp-2">
            <strong>Description:</strong> {job.job_post?.description}
          </Paragraph>
          {/* <Divider /> */}
          {/* <p>
            <strong>Cover Letter:</strong> {job.cover_letter}
          </p> */}
          <p>
            <small>Applied {relativeTime}</small>
          </p>
        </Col>
      </Row>
    </Card>
  );
};

const JobList = ({ jobs }) => {
  return (
    <div>
      {jobs?.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
