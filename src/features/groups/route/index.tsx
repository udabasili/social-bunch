import React, { Component } from "react";
import Modal from "@/components/Modal/Modal";
import GroupForm from "../component/GroupForm";
import GroupDetails from "./GroupDetails";
import GroupList from "./GroupList";
import { MainLayout } from "@/components/Layout/MainLayout";
import { GroupAttributes } from "../type";

type Props = {};

type State = {
  showModal: boolean;
  currentSelected: GroupAttributes | null;
};

export class GroupPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      currentSelected: null,
    };
  }

  showModalHandler = (show: boolean) => {
    this.setState((prevState) => ({
      ...prevState,
      showModal: show,
    }));
  };

  selectGroupHandler = (group: GroupAttributes | null) => {
    this.setState((prevState) => ({
      ...prevState,
      currentSelected: group,
    }));
  };

  render() {
    const { showModal, currentSelected } = this.state;
    return (
      <MainLayout>
        <div className="events-page">
          {showModal && (
            <Modal>
              <GroupForm showModalHandler={this.showModalHandler} />
            </Modal>
          )}
          <GroupList
            showModalHandler={this.showModalHandler}
            selectGroupHandler={this.selectGroupHandler}
          />
          {currentSelected && (
            <GroupDetails
              group={currentSelected}
              selectGroupHandler={this.selectGroupHandler}
            />
          )}
        </div>
      </MainLayout>
    );
  }
}
