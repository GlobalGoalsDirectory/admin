import { render, screen } from "@testing-library/react";
import { useLocalObservable } from "mobx-react-lite";
import { setupReviewStore, ReviewStoreProvider } from "stores/reviewStore";
import ReviewStep from "components/ReviewStep";

describe("new organization", () => {
  const ReviewStepContainer = () => {
    const reviewStore = useLocalObservable(
      setupReviewStore({
        extractedData: {
          test: "text-suggested-by-AI",
        },
      })
    );

    return (
      <ReviewStoreProvider store={reviewStore}>
        <ReviewStep field="test" />
      </ReviewStoreProvider>
    );
  };

  test("it prefills suggested value", () => {
    render(<ReviewStepContainer />);
    expect(screen.getByLabelText("Test")).toHaveValue("text-suggested-by-AI");
  });

  test("it selects AI suggestion as default", () => {
    render(<ReviewStepContainer />);
    expect(screen.getByTestId("ai-suggestion")).toBeChecked();
  });

  test("it shows accept, reject, and skip actions", () => {
    render(<ReviewStepContainer />);
    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
    expect(screen.getByText("Skip")).toBeInTheDocument();
  });
});
