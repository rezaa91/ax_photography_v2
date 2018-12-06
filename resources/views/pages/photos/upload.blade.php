@extends('layouts.app')

@section('content')

<div class = 'upload-wrapper'>

    <div class = 'title'>
        <h1>Upload Images</h1>
    </div>

    {!! Form::open(['action' => 'Photos\AlbumsController@store', 'method' => 'POST', 'enctype' => 'multipart/form-data', 'id' => 'form']) !!}

    <div class='form-section'>
        {{ Form::label('title *') }}
        {{ Form::text('title', '') }}
    </div>

    <div class='form-section'>
        {{ Form::label('description') }}
        {{ Form::textarea('description', '', ['placeholder' => 'optional...']) }}
    </div>

    <div class='form-section'>
        {{ Form::label('album *') }}
        <div class='selection'>
            <div class='option'>Existing: {{ Form::radio('album_type', 'existing', true) }}</div>
            <div class='option'>New: {{ Form::radio('album_type', 'new', false) }}</div>
        </div>
    </div>

    <div class="form-section" id="select_album">
        @if ($albums)
            <select name='album'>
                <option value="default">Choose an album below...</option>
                @foreach($albums as $album)
                    <option value="{{ $album->album_id }}">{{ $album->album_name }}</option>
                @endforeach
            </select>
        @endif
    </div>    
    
    <div class='form-section hide' id="create_album">
        {{ Form::text('create_album', '', ['placeholder' => 'Album Title...']) }}
    </div>

    <div class='form-section'>
        {{ Form::file('file') }}
    </div>

    <div class='form-section'>
        {{ Form::submit('Upload') }}
    </div>

    {!! Form::close() !!}
    
</div>

@endsection