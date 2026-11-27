"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/ui";

export function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete your account?"
        description="This removes your profile, plays and uploaded images."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Delete forever</Button>
          </>
        }
      >
        This can&apos;t be undone. Escape, the close button or clicking outside closes this dialog.
      </Modal>
    </div>
  );
}
