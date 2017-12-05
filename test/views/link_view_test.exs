defmodule Linklet.LinkViewTest do
  use Linklet.ConnCase
  import Linklet.Factory
  alias Linklet.LinkView
  alias Linklet.UserView

  test "link_json" do
    link = insert(:link)

    rendered_link = LinkView.link_json(link)

    assert rendered_link == %{
      id: link.id,
      title: link.title,
      url: link.url,
      inserted_at: link.inserted_at,
      updated_at: link.updated_at,
      user: UserView.user_json(link.user),
      comments_count: 0
    }
  end

  test "index.json" do
    link = insert(:link)

    rendered_links = LinkView.render("index.json", %{links: [link]})

    assert rendered_links == [LinkView.link_json(link)]
  end

  test "show.json" do
    link = insert(:link) |> Repo.preload([:user, [comments: :user]])

    rendered_link = LinkView.render("show.json", %{link: link})

    assert rendered_link == LinkView.link_json(link)
  end

end
