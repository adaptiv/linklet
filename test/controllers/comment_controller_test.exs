defmodule Pheddit.CommentControllerTest do
  use Pheddit.ConnCase

  def get_authenticated_conn(user \\ nil) do
    user =  if (user == nil), do: insert(:user), else: user

    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user)

    build_conn()
    |> put_req_header("authorization", "Bearer #{jwt}")
  end

  test "#create adds a new comment" do
    link = insert(:link)

    comment = %{body: "A wonderful comment", link_id: link.id}

    conn = post get_authenticated_conn(link.user), "/api/comments", comment

    response = json_response(conn, :created) |> Poison.encode! |> Poison.decode!

    %{"body" => body, "link_id" => link_id, "user" => user} = response

    assert comment.body == body
    assert user["id"] > 0
  end

  test "#create authenticates before creating a comment" do
    comment = %{body: "A wonderful comment", link_id: 1}

    conn = build_conn()

    response = post conn, "/api/comments", comment
    assert response.status == 401
  end

end
