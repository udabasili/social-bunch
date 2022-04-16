import React, { Component } from "react";
import Modal from "@/components/Modal/Modal";
import EventForm from "../component/EventForm";
import EventDetails from "./EventDetails";
import EventList from "./EventList";
import { MainLayout } from "@/components/Layout/MainLayout";
import { EventAttributes } from "../type";

type Props = {};

type State = {
  showModal: boolean;
  currentSelected: EventAttributes | null;
};

export class EventPage extends Component<Props, State> {
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

  selectEventHandler = (event: EventAttributes | null) => {
    this.setState((prevState) => ({
      ...prevState,
      currentSelected: event,
    }));
  };

  render() {
    const { showModal, currentSelected } = this.state;
    return (
      <MainLayout>
        <div className="events-page">
          {showModal && (
            <Modal>
              <EventForm showModalHandler={this.showModalHandler} />
            </Modal>
          )}
          <EventList
            showModalHandler={this.showModalHandler}
            selectEventHandler={this.selectEventHandler}
          />
          {currentSelected && (
            <EventDetails
              event={currentSelected}
              selectEventHandler={this.selectEventHandler}
            />
          )}
        </div>
      </MainLayout>
    );
  }
}
