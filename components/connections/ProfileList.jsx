import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading2 } from '../~common';
import ExploreCard from '../explore/ExploreCard';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Profiles = styled.div`
  box-sizing: border-box;
  margin-top: 2rem;
  margin-bottom: 4rem;
  padding: 0 0.5rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

function ProfileList({ users }) {
  return (
    <Wrapper>
      <Heading2>My Connect</Heading2>
      <Profiles>
        { users.map((profile) => <ExploreCard {...profile} />) }
      </Profiles>
    </Wrapper>
  );
}

ProfileList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default ProfileList;
