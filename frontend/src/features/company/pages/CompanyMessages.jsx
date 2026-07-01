import ConversationList from "../messages/ConversationList";
import ChatWindow from "../messages/ChatWindow";

const CompanyMessages = () => {
  return (
    <div className="flex">

      <div>
        <ConversationList />
      </div>

      <div>
        <ChatWindow />
      </div>

    </div>
  );
};

export default CompanyMessages;