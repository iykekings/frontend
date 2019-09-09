/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Flip from 'react-reveal/Flip';
import Router from 'next/router';
import { connect } from 'react-redux';
import {
  userTypeHandler,
  getJobTitles,
  getMentorType
} from '../../redux/actions/authActions';
import Steps from './StepsComp';
import { theme } from '../../lib/theme';
import { Heading2, Button, Text } from '../~common/index';

const err = {
  jobTypeError: 'Plseae select a Job Type',
  userTypeError: 'Please select a user type',
  userOptionError: 'Minimum one filed required'
};

const JobTitle = ({
  userTypeHandler,
  username,
  loading,
  getJobTitles,
  allJobs,
  locationId,
  getMentorType,
  mentorTypes
}) => {
  const [mentorPressed, setMentorPressed] = useState(false);
  const [menteeePresed, setMenteePressed] = useState(false);
  const [userType, setUserType] = useState('');
  const [mentorError, setMentorError] = useState(true);
  const [jobTypeId, setJobTypeId] = useState(100);
  const [errors, setErrors] = useState({
    jobError: false,
    userTypeError: false,
    helpError: false
  });
  const [testError, setTestError] = useState(false);
  //const [checkedValue, setCheckedValue] = useState({});
  const [options, setOptions] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getJobTitles();
    getMentorType();
  }, []);

  const handleSelect = e => {
    if (e.target.value === 100 || e.target.value === 'Choose Job Type') {
      setErrors({ jobError: true });
      setTestError(true);
    } else {
      setJobTypeId(e.target.value);
      setErrors({ jobError: false });
      setTestError(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    //Handling Job type error
    if (jobTypeId === 100) {
      setErrors({ jobError: true });
      setTestError(true);
    } else {
      setErrors({ jobError: false });
      setTestError(false);
    }

    const data = {
      locationId,
      industryId: '1'
    };
    //Handling user Type Error
    if (!mentorPressed && !menteeePresed) {
      setErrors({ userTypeError: true });
    } else if (jobTypeId === 100) {
      setErrors({ jobError: true });
      setTestError(true);
    } else {
      setErrors({ userTypeError: false });
      userTypeHandler(data, username, userType, jobTypeId).then(res => {
        if (res === 201) {
          Router.push('/auth/profile-info');
        }
      });
    }
  };

  const handleCheckBox = e => {
    // const op = [];
    // setChecked(e.target.checked);
    // console.log(e.target.checked);
    // //op.push(e.target.name);
    // setOptions(options.concat(e.target.name));
  };

  const mentor = () => {
    return (
      <div>
        <M>
          <Text small>What kind of help are you provide ?</Text>
          {mentorTypes &&
            mentorTypes.map(type => {
              return (
                <Flip top key={type.id}>
                  <Label key={type.id}>
                    <input
                      type="checkbox"
                      name={type.id}
                      onChange={handleCheckBox}
                    />
                    {type.mentor_type_name}
                  </Label>
                </Flip>
              );
            })}
          {/* {!checked && <Error>{err.userOptionError} </Error>} */}
        </M>
      </div>
    );
  };
  const mentee = () => {
    return (
      <M>
        <Text small>What kind of help are you looking for ?</Text>
        {mentorTypes &&
          mentorTypes.map(type => {
            return (
              <Flip top key={type.id}>
                <Label key={type.id}>
                  <input
                    type="checkbox"
                    name={type.id}
                    onChange={handleCheckBox}
                  />
                  {type.mentor_type_name}
                </Label>
              </Flip>
            );
          })}
      </M>
    );
  };

  const onMenteePressed = () => {
    setMenteePressed(true);
    setMentorPressed(false);
    setErrors({ userTypeError: false });
    setUserType('mentee');
  };

  const onMentorPressed = () => {
    setMenteePressed(false);
    setMentorPressed(true);
    setErrors({ userTypeError: false });
    setUserType('mentor');
  };
  return (
    <Root>
      <Steps stepNumber="3" />
      <Header>
        <Heading2 primary>Mentorship Info</Heading2>
        <Text small>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nisl
          nisl, aliquam nec erat et, efficitur mollis metus.
        </Text>
      </Header>
      <MentorIcons>
        <Costum>
          <i
            className="fas fa-user-graduate fa-6x"
            style={{ color: menteeePresed && theme.primary }}
            onClick={onMenteePressed}
          ></i>
          <Info>
            <p>Mentee</p>
            <i className="fas fa-info-circle"></i>
          </Info>
        </Costum>
        <Costum>
          <i
            className="fas fa-user-cog fa-6x"
            style={{ color: mentorPressed && theme.primary }}
            onClick={onMentorPressed}
          ></i>
          <Info>
            <p>Mentor</p>
            <i className="fas fa-info-circle"></i>
          </Info>
        </Costum>
        {errors.userTypeError && <MError>{err.userTypeError}</MError>}
      </MentorIcons>
      <FormArea onSubmit={handleSubmit}>
        <InputWrapper>
          <select value={jobTypeId} onChange={handleSelect}>
            <option>Choose Job Type</option>
            {allJobs &&
              allJobs.map(job => {
                return (
                  <option value={job.id} key={job.tech_name}>
                    {job.tech_name}
                  </option>
                );
              })}
          </select>
          {testError && <Error>{err.jobTypeError}</Error>}
        </InputWrapper>
        {menteeePresed && mentee()}
        {mentorPressed && mentor()}
        <Button
          small
          primary
          type="submit"
          loadingB={loading}
          onClick={handleSubmit}
        >
          Next
        </Button>
      </FormArea>
      {mentorError && (
        <Text small style={{ color: 'red' }}>
          Menthorship type is required*
        </Text>
      )}
    </Root>
  );
};

const mapStateToProps = state => {
  return {
    username: state.authReducer.emailData.username,
    loading: state.authReducer.loading,
    allJobs: state.authReducer.allJobs,
    locationId: state.authReducer.locationId,
    mentorTypes: state.authReducer.allMentorOptions
  };
};
const mapDispatchToProps = {
  userTypeHandler,
  getJobTitles,
  getMentorType
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobTitle);

const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 40px 0;
  p {
    padding: 0 20px;
    text-align: center;

    @media (min-width: 500px) {
      width: 50%;
    }
  }
`;

const MentorIcons = styled.div`
  width: 85%;
  display: flex;
  justify-content: space-around;
  position: relative;
  padding-bottom: 20px;

  @media (min-width: 500px) {
    width: 50%;
  }
  i {
    color: grey;
  }
`;

const Costum = styled.div`
  display: flex;
  flex-direction: column;
  i {
    transition: all 0.2s ease-in;

    :hover {
      cursor: pointer;
    }
  }
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const Info = styled.div`
  display: flex;
  align-self: flex-end;
  margin: 3px;
  align-items: center;

  i {
    padding-left: 5px;
    color: black;
  }
`;

const FormArea = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: auto;
  padding: 30px 0;
  @media (min-width: 500px) {
    width: 50%;
  }

  button {
    margin-top: 30px;
  }

  @media (min-width: 500px) {
    width: 50%;
  }

  input {
    padding: 0.5rem;
    font-size: 16px;
    width: 70%;
    display: block;
    color: #4d2d52;
    border: 1px solid rgba(77, 45, 82, 0.8);
    border-radius: 4px;
    ::placeholder {
      color: grey;
      opacity: 0.4;
    }
  }

  select {
    display: block;
    font-size: 14px;
    line-height: 1.3;
    padding: 0.6em 1.4em 0.5em 0.8em;
    width: 75%;
    border: 1px solid rgba(77, 45, 82, 0.8);
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 0.65em auto, 100%;

    @media (min-width: 500px) {
      width: 70%;
    }
    option {
      color: grey;
      opacity: 0.4;
    }
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 30px;
`;

const Error = styled.p`
  margin: 0;
  font-size: 14px;
  position: absolute;
  bottom: 10%;
  left: 15%;
  color: #e29273;
`;

const MError = styled.p`
  margin: 0;
  font-size: 14px;
  position: absolute;
  bottom: 0;
  left: 26%;
  color: #e29273;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-left: 30px;
  input {
    width: 5px;
    height: 5px;
    padding: 12px;
    margin-right: 12px;
  }
`;

const M = styled.div`
  margin-bottom: 20px;
`;
